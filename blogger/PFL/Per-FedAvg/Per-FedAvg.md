# Personalized Federated Learning with Theoretical Guarantees: A Model-Agnostic Meta-Learning Approach 解读

## 问题提出

* 有些方法在解决non-IID的时候使用能够拥有一定的个性化程度
* 从MAML迁移到pFL的时候，没有考虑到pFL的问题：
  * 只能local 和 global之间进行通信
  * client的多步的优化
  * 数据non-IID，随机梯度噪声等问题
  
## 解决方法

### 问题1：FedAvg 目标只关心 (f_i(w))，不关心本地适配后效果

**解决方法：** 把目标改为 MAML 形式（一步适配后的平均损失）
$$
F(w)=\frac1n\sum_{i=1}^n f_i\big(w-\alpha\nabla f_i(w)\big) \tag{3}
$$

### 问题 2：Global无法使用server数据，应该怎么求上述式子


**解决方法：** 定义每个用户的 meta-function
$$ F_i(w)=f_i\big(w-\alpha\nabla f_i(w)\big) $$


### 问题 3：对于每个client怎么求解上式




* 初始化：$(w^i_{k+1,0}=w_k)$
* 做 (\tau) 次本地 meta-SGD：
  $$
  w^i_{k+1,t}=w^i_{k+1,t-1}-\beta,\widetilde{\nabla}F_i(w^i_{k+1,t-1}) \tag{7}
  $$

$$
\big(I-\alpha\widetilde{\nabla}^2 f_i(w,D''_{i,t})\big)
\widetilde{\nabla} f_i\Big(w-\alpha\widetilde{\nabla} f_i(w,D_{i,t}),;D'_{i,t}\Big) \tag{8}
$$

按照两步执行：

1. inner：$\tilde w=w-\alpha \widetilde{\nabla} f_i(w,D_{i,t})$
2. outer：$w\leftarrow w-\beta (I-\alpha \widetilde{\nabla}^2 f_i(w,D''))\widetilde{\nabla}f_i(\tilde w,D')$



### 问题 4：server 聚合：如何得到下一轮初始化？

**解决方法：** FedAvg 式平均
$$
w_{k+1}=\frac{1}{rn}\sum_{i\in A_k} w^i_{k+1,\tau}
$$

![algo](algo1.png)