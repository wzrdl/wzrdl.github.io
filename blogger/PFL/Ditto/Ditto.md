# Ditto: Fair and Robust Federated Learning Through Personalization 解读

## 问题提出
* 强公平策略，比如取平均之类的，往往更关注"离群/稀有更新"，攻击者可以伪装成离群点，导致整个框架脆弱，
* 强robust的策略往往会使得弱势点更加弱势

## 一句话解释问题

本文希望提出一个方法来平衡robust和fair之间的关系，并且保证FL的可拓展性

## 解决方法

### 问题1：如何解决单一global weight 不够公平，不够personalization

**解决方法：** 把“一个模型”变成“全局参考 + 本地个性化”，每个客户端维护私有个性化模型 (v_k)，只把 (w^t) 当“锚点”而不是最终答案，每个被采样客户端 (k) 在本地做两条并行任务：

#### 任务 A：更新全局 (w)

* 初始化临时副本：$w_{\text{local}} \leftarrow w^t$
* 在本地跑 (E) 步 SGD 得到 $w_k^t$
* 上传 $\Delta_k^t = w_k^t - w^t$


#### 任务 B：个性化更新本地最终模型 $(v_k)$

* 用当前全局 $(w^t)$ 作锚点，对 $(v_k)$ 做 $s$ 步更新：

$$v_k \leftarrow v_k - \eta\big(\nabla F_k(v_k) + \lambda(v_k - w^t)\big)$$


---

### 问题 2：公平与鲁棒的强弱随场景变化，需要可调节，而不是固定策略

**解决方法：** 用 $\lambda$ 控制依赖程度，直观的理解就是，当$\lambda$趋近于0，Ditto更加偏向于本地模型，当$\lambda$趋近于正无穷，Ditto更趋向于全局模型


### 问题 3：整个流程是什么样的

**解决方法：** 整个的算法流程如下：
* 随机的选择t个client，并将全局的参数传入这些模型
* 对于每一个device：
  * 训练一个上传到global的参数 $\Delta_k^t = w_k^t - w^t$
  * 并且同时训练一个不上传的本地参数 
    $$v_k \leftarrow v_k - \eta\big(\nabla F_k(v_k) + \lambda(v_k - w^t)\big)$$
* Global对所有上传的参数进行聚合
  
![algo](algo1.png)