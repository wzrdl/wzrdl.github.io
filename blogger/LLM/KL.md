# KL

## 为什么要有 KL 散度，他在解决一个什么问题？

在概率论中，有一个真实的分布 $P$，还有一个我们拿来近似的分布 $Q$。  
问题是：**这个近似分布 \(Q\) 离真实分布 \(P\) 有多远？**  
KL 散度解决的是：**如果我们用一个错误的概率分布去替代真实的概率分布，到底亏了多少信息**。

## 之前的工作是如何解决的？

之前的工作常用欧氏距离等方法来度量分布之间的差异，但这些方法与现在主流的信息论观点有点脱节。  
在深度学习中，大多数 loss 都是基于信息熵来定义的，所以 KL 散度同样是基于信息熵的理论来刻画两个分布之间的差异。

## 他的解决方法是什么？

KL 散度可以从一个很直观的角度来理解：  
**KL = 交叉熵 − 信息熵**。

直观地说，如果真实分布是 $P$，而我们用 $Q$ 去近似它，那么 KL 散度刻画的是：  
> 因为用错了分布（用 $Q$ 替代 $P$）而**额外损失了多少信息**。

设离散随机变量 $x$ 的真实分布为 $P(x)$，近似分布为 $Q(x)$，则

$$
H(P) = - \sum_x P(x)\,\log P(x)
$$

$$
H(P, Q) = - \sum_x P(x)\,\log Q(x)
$$

于是 KL 散度可以写成

$$
D_{\mathrm{KL}}(P \,\|\, Q)
  = H(P, Q) - H(P)
  = - \sum_x P(x)\log Q(x) + \sum_x P(x)\log P(x).
$$

进一步整理得到最常见的形式：

$$
D_{\mathrm{KL}}(P \,\|\, Q)
  = \sum_x P(x)\bigl(\log P(x) - \log Q(x)\bigr)
  = \sum_x P(x)\log\frac{P(x)}{Q(x)}.
$$

## 工程的角度上是怎么实现 KL 的？

为什么会有工程上的问题？因为整个任务是 **token 级** 的：  
如果在生成每一个 token 时都对整个词表精确计算 KL，整个过程会变得非常耗时。

因此 DeepSeek 在实现 KL 的时候，使用的是 **rollout level 的 KL 散度近似**，而不是对每个 step、每个词表元素都做精确 KL。

设：
- $q$ 表示当前的 query（输入）；
- $o_i = (o_{i,1}, \dots, o_{i,T_i})$ 表示第 $i$ 条完整的 rollout（模型生成的一整条输出序列）；
- $\pi_\theta$ 是当前策略（被优化的模型）；
- $\pi_{\mathrm{ref}}$ 是参考策略（比如基座模型）。

在 DeepSeek 使用的一种近似形式中，有：

$$
D_{\mathrm{KL}}\bigl(\pi_\theta \,\|\, \pi_{\mathrm{ref}}\bigr)
\approx 
\frac{\pi_\theta(o_i \mid q)}{\pi_{\mathrm{ref}}(o_i \mid q)}
 - \log \frac{\pi_\theta(o_i \mid q)}{\pi_{\mathrm{ref}}(o_i \mid q)}
 - 1.
$$

从 token 级别看，一条 rollout 的概率可以分解为：

$$
\pi_\theta(o_i \mid q)
  = \prod_{t=1}^{T_i} \pi_\theta\bigl(o_{i,t} \mid q, o_{i,<t}\bigr),
$$

$$
\pi_{\mathrm{ref}}(o_i \mid q)
  = \prod_{t=1}^{T_i} \pi_{\mathrm{ref}}\bigl(o_{i,t} \mid q, o_{i,<t}\bigr),
$$

其中 $o_{i,<t} = (o_{i,1}, \dots, o_{i,t-1})$。

因此整条序列在两个策略下的概率比值为

$$
\frac{\pi_\theta(o_i \mid q)}{\pi_{\mathrm{ref}}(o_i \mid q)}
  = \prod_{t=1}^{T_i} 
    \frac{\pi_\theta\bigl(o_{i,t} \mid q, o_{i,<t}\bigr)}
         {\pi_{\mathrm{ref}}\bigl(o_{i,t} \mid q, o_{i,<t}\bigr)}.
$$

简单来说：
- **先采样完整的 rollout**；
- 用每个 token 的 logit 计算出整条序列在 $\pi_\theta$ 和 $\pi_{\mathrm{ref}}$ 下的概率；
- 通过上面的近似公式得到一个 rollout level 的 KL，代替逐 token、逐词表的精确 KL 计算，从而在工程上大幅减小计算量。
