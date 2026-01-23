# Scheduler中的一些代码逻辑

```python
    def schedule(self) -> tuple[list[Sequence], bool]:  # 调度一次
        # prefill
        scheduled_seqs = []  # 已选序列
        num_seqs = 0  # 计数
        num_batched_tokens = 0  # 本次 token 数
        while self.waiting and num_seqs < self.max_num_seqs:  # 尝试填充 prefill
            seq = self.waiting[0]  # 查看队首
            if num_batched_tokens + len(seq) > self.max_num_batched_tokens or not self.block_manager.can_allocate(seq):  # 超限或不可分配
                break  # 停止选择
            num_seqs += 1  # 计数+1
            self.block_manager.allocate(seq)  # 分配块
            num_batched_tokens += len(seq) - seq.num_cached_tokens  # 累计未缓存 token
            seq.status = SequenceStatus.RUNNING  # 状态置运行
            self.waiting.popleft()  # 移出等待
            self.running.append(seq)  # 加入运行
            scheduled_seqs.append(seq)  # 记录
        if scheduled_seqs:  # 若有 prefill
            return scheduled_seqs, True  # 返回并标记 prefill

        # decode
        while self.running and num_seqs < self.max_num_seqs:  # 处理解码阶段
            seq = self.running.popleft()  # 取队首
            while not self.block_manager.can_append(seq):  # 若无法追加
                if self.running:  # 还有其它运行
                    self.preempt(self.running.pop())  # 抢占最后一个运行
                else:  # 只剩自己
                    self.preempt(seq)  # 抢占自身
                    break  # 退出
            else:  # 可以追加
                num_seqs += 1  # 计数+1
                self.block_manager.may_append(seq)  # 处理块追加/哈希
                scheduled_seqs.append(seq)  # 记录
        assert scheduled_seqs  # 解码时必须调度到
        self.running.extendleft(reversed(scheduled_seqs))  # 保持顺序回填运行队列
        return scheduled_seqs, False  # 返回并标记解码
```
这篇来讲解一下schedule的逻辑，这里将阶段分为了两个互斥的阶段一个是prefill另一个是decode，这是为了性能的优化

这里分开讲这两个过程，首先是prefill：
```python
# prefill
while self.waiting and num_seqs < self.max_num_seqs:  # 只要有人排队 且 没达到最大并发数
    seq = self.waiting[0]  # 看一眼队首的人
    
    # 【硬限制检查】
    # 1. 计算量限制：加上这个人会不会导致 Token 太多算不过来？
    # 2. 显存限制：KV Cache 块够不够分配给这个人的 Prompt？
    if num_batched_tokens + len(seq) > self.max_num_batched_tokens or not self.block_manager.can_allocate(seq):
        break  # 只要有一个条件不满足，立刻停止，不强行塞入
    
    # 【分配资源】
    self.block_manager.allocate(seq)  # 真正扣除显存块
    # 注意：只计算“未缓存”的 Token 数量计入计算负载（Prefix Caching 的体现）
    num_batched_tokens += len(seq) - seq.num_cached_tokens 
    
    # 【状态流转】
    seq.status = SequenceStatus.RUNNING  # 标记为运行中
    self.waiting.popleft()  # 移出排队区
    self.running.append(seq)  # 放入就餐区
    scheduled_seqs.append(seq)  # 加入本次调度名单

if scheduled_seqs:  # 如果成功调度了 Prefill 任务
    return scheduled_seqs, True  # 直接返回！不再处理 Decode
```
主要逻辑是：
* 先检查队列中的进程
* 然后查看队首的元素，并且计算当前的seq是否超过了token限制以及KV cache限制
* 对当前seq分配显存
* 进行队列元素状态的流转
* 判断是否进行prefill任务并返回

第二个步骤是Decode
```python
# decode
while self.running and num_seqs < self.max_num_seqs:
    seq = self.running.popleft()  # 取出一个正在运行的序列
    
    # 【显存不足的危机处理】
    # 尝试给这个序列追加 1 个 Token 的槽位。如果 block_manager 说“没空位了”：
    while not self.block_manager.can_append(seq): 
        # 此时发生了“显存争用”
        if self.running: 
            # 策略：牺牲别人，保全自己
            # 从运行队列末尾拿出一个倒霉蛋（通常是优先级低或最后加入的）
            victim = self.running.pop() 
            self.preempt(victim)  # 抢占它（释放它的显存块，把它踢回 Waiting 或 CPU）
            # 循环继续，再次检查现在能不能给 seq 分配显存了
        else: 
            # 策略：没人可牺牲了，只能牺牲自己
            self.preempt(seq) 
            break  # 退出循环，当前 seq 无法调度
            
    else: # Python 的 for/while-else 语法：如果循环没有被 break (即成功分配了显存)
        num_seqs += 1
        self.block_manager.may_append(seq) # 物理上确认追加
        scheduled_seqs.append(seq) # 加入调度名单

# 【恢复队列顺序】
# 因为上面是 popleft 取出的，为了保持 Round-Robin 公平性，把处理完的序列放回队列左侧（或保持原序）
self.running.extendleft(reversed(scheduled_seqs)) 
return scheduled_seqs, False # 返回，第二个参数 False 代表是 Decode 阶段
```
这一段的主要逻辑是在显存争用的地方
* 首先取出一个正在运行的序列
* 查看能不能给当前序列添加一个token的位置
* 如果不能，则取出运行队尾的，将它踢回waiting或者CPU
* 如果没人牺牲则牺牲自己
* 否则就直接分配显存并添加一个token的位置
* 最后恢复队列的顺序
  
这里的抢占的思想是，对于队首的任务我们不抢占它，因为它已经运行了很久，生成了很多的token，积累了大量的KV cache，如果现在抢占它那么之前的计算相当于白费了

对于队尾的任务，也就是刚从waiting进来的任务，KV cache占用的比较少，我们可以抢占这些任务的内存空间给当前任务

这里需要注意的另一点就是我之前提到的互斥型任务，Prefill是计算密集型任务，Decode是访存密集型任务，为了不让这两个任务混在一起拖慢整体的性能，所以我们将这两个任务分开来运行，也就是第一段代码需要return的原因