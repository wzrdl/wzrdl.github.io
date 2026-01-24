# Block Manager的逻辑
```python
    def allocate(self, seq: Sequence):  # 为序列分配并复用块
        assert not seq.block_table  # 确保未已有块表
        h = -1  # 当前哈希前缀
        cache_miss = False  # 是否缓存未命中
        for i in range(seq.num_blocks):  # 遍历每个逻辑块
            token_ids = seq.block(i)  # 获取块内 tokens
            h = self.compute_hash(token_ids, h) if len(token_ids) == self.block_size else -1  # 完整块则链式哈希
            block_id = self.hash_to_block_id.get(h, -1)  # 查询是否有缓存块
            if block_id == -1 or self.blocks[block_id].token_ids != token_ids:  # 无匹配或内容不同
                cache_miss = True  # 标记未命中
            if cache_miss:  # 未命中则新分配
                block_id = self.free_block_ids[0]  # 取一个空闲块
                block = self._allocate_block(block_id)  # 分配块
            else:  # 命中则复用
                seq.num_cached_tokens += self.block_size  # 增加缓存计数
                if block_id in self.used_block_ids:  # 块已被使用
                    block = self.blocks[block_id]  # 获取块
                    block.ref_count += 1  # 引用 +1
                else:  # 缓存存在但未使用
                    block = self._allocate_block(block_id)  # 分配块
            if h != -1:  # 若有哈希值
                block.update(h, token_ids)  # 更新块内容与哈希
                self.hash_to_block_id[h] = block_id  # 记录哈希映射
            seq.block_table.append(block_id)  # 记录块 ID 到序列表
```
用一个样例直接演示一遍整个allocate的过程

假设 `block_size=4`
seq 的 tokens：`[1,2,3,4,  5,6,7,8,  9]`
那么：

* block0 = [1,2,3,4]（满）
* block1 = [5,6,7,8]（满）
* block2 = [9]（不满）

### i=0（满块）

* 计算 h0
* 查目录看有没有 h0
* 如果命中且 token 一致：复用
* 否则：新分配

### i=1（满块）

* 用 h0 做 prefix，算 h1
* 查目录有没有 h1
* 若 i=0 miss 了，`cache_miss=True`，则这里即便目录有也**不复用**，直接新分配

### i=2（不满块）

* h=-1
* block_id = hash_to_block_id.get(-1,-1) => -1
* 于是 `cache_miss=True`
* 新分配一个块（用于承载后续生成）


## Can_append的逻辑

```python
    def can_append(self, seq: Sequence) -> bool:  # 判断是否有空闲块可追加
        return len(self.free_block_ids) >= (len(seq) % self.block_size == 1)  # 若需新块则需至少一块空闲
```
这个can_append的逻辑有时候会让人很迷惑，但是仔细看一下使用can_append的定位，是在decode的阶段，decode的阶段是一个一个token的生成的，因此我们需要判断：
当前token是不是新block的第一个元素
当前token是其他的状态

