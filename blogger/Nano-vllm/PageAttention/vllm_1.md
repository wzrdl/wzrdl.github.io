# vllm的核心技术

### 推理的两个阶段
在讲解vllm的核心技术之前，先讲解一下LLM推理的两个阶段，一个是prefill，另一个是decode

### Prefill
prefill阶段是将用户的输入prompt喂给模型做forward计算，采用kvcache技术， 我们将prompt通过这个方法存在cache_k和cache_v中，我们在后面的计算的时候，不需要前面对token的重复计算了，节省推理时间。

### Decode
Decode阶段是在用户输入之后，生成response阶段，在这个阶段，我们根据prefill的结果，一个一个token的生成结果，同样在decode阶段，模型储存KV值进入cache，因为Decode是逐token生成的，所以没法像prefill的方式一样做大段的并行计算

### 传统KV cache的问题
* 随着prompt的数量变多以及decode的序列变长，KV cache变得很大，对GPU的显存造成的压力很大
* 由于输出的序列长度无法知道，所以我们没法对KV cache量身定制存储空间

因为在推理的过程中，我们将推理服务打包成一个server，它接受客户端的request，读取请求中的prompt来做推理，一个请求只有1个prompt，也可以有多个prompt，因此我们会在显存上出现这样的情况

![old_kvcache](old_kvcache.jpg)


### 操作系统的虚拟内存

PageAttention的问题就是来解决KV cache的分配问题，通过动态地为request分配KV cache，提升显存利用率，主要的思想来源于计算机的虚拟内存的分页管理的思想，我们不过多介绍这个，只介绍简短的主要思想：
* 将物理内存划分为固定大小的块，我们将这个每一块称之为Page，从物理内存中模拟出来的虚拟内存也按相同的方法做划分
* 对于一个进程，我们不需要静态的加载它的全部代码以及数据内容，我们想用哪部分，或者它目前进行到哪部分，我们就动态的加载这部分到虚拟内存上，然后由虚拟内存帮我们做物理内存的映射
* 对于一个进程，尽管在物理内存上的存储不连续（分布在不同的Page中），但是在自己的虚拟内存上是连续的，通过映射表来实习。通过模拟连续内存的方法，解决了物理内存上的碎片问题，同样方便进程的开发和运行

### PageAttention
我们已经了解了虚拟内存分页的基本原理，接下来会详细讲述如何实现PageAttention，假设我们向服务器发送请求，prompt为 "Four score and seven years ago our"，在图中这样显示：

![block](block_table.jpg)

我们详细讲述一下图中的几个block:
* Request在这里是prompt，可以理解为操作系统中的进程
* Logical KV blocks可以理解为虚拟内存，每一个block等价于虚拟内存中的一个Page，每个block大小固定，vllm默认16，即一个block装16个token的KV值
* Block table可以理解为虚拟内存到物理内存的哈希映射表
* Physical KV Blocks可以理解为操作系统中的物理内存，这个内存是在GPU的显存上的
  
### Prefill阶段
在vllm拿到prompt的时候，按照预先设定好的block大小为prompt划分逻辑块(logical KV Blocks)，在这个样例中，prompt划分之后出现了一个保留位(reservation)

在划分好logical KV Blocks之后，就可以将Blocks hash映射到真实物理内存上去，Block tables上有两个内容:
* 一个是physical block number，比如logical KV block 0 对应的是physical block 7
* 另一个是每个物理块上被填满的槽位(filled)：比如在物理块7对应的4个槽位都被填满，但是物理块1只有3个槽位被填满
  
### Decode阶段
使用KV cache进行推理，因为有block table的存在，每个request都会认为自己在一个连续的内存空间上进行操作，然后我们生成一个新的token，更新逻辑块，filled以及block table，处理多个请求如下：
![mulit_request](multi_request.jpg)

## 分布式管理

vllm最重要的就是在多卡并行的情况下的优化，如图所示：
![distribution](distribution.jpg)
