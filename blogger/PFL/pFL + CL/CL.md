# CL综述

## CL分类
CL总共可以分为5大类，分别是：
* regularization-based
* replay-based
* optimization-based
* representation-based
* architecture-based

## Task分类
从增量批次和task种类来分类，可以分为一下几种：
* Instance-Incremental Learning (IIL)：所有training sample属于一个task
* Domain-Incremental Learning (DIL)：数据不同的分布，但是lable是一样的
* Task-Incremental Learning (TIL)：数据不同分布，并且label不一样，训练和测试系统知道任务输入属于哪一个task
* Class-Incremental Learning (CIL)：数据不同分布，并且label不一样，只有训练系统知道任务输入属于哪一个task
* Task-Free Continual Learning (TFCL)：数据不同分布，并且label不一样，测试和训练系统都不知道任务输入属于哪一个task
* Online Continual Learning (OCL)：和TFCL一样，但是数据按照one-pass的数据流到来
* Continual Pre-training (CPT)：预训练数据按序到来，目标是提升对下游任务的知识迁移

## 评估标准

### AA和AIA
AA是在训练完成任务后，原来的所有k个任务的平均准确率，最终能力
AIA是将AA取平均，对每一步训练切换的时刻的AA取平均，每一步的平均表现

### FM和BWT
FM是对每个旧任务的历史时刻的最好减去当前学完的平均差值
BWT是对当前任务减去刚学完该任务的成绩取平均
核心区别是一个取的是峰值，一个取的是刚学完的值，并且两者的正负是相反的

### IM和FWT
IM简单表示为理想的joint training 和 真实的CL在刚刚学完k任务的时候的差距有多大
FWT表示为CL刚刚学完k任务的时候与一个从零开始只学j任务的单任务模型的差距

## Stability-Plasticity Trade-Off
将整个任务建模成为一个概率模型，遗忘的问题根源是在学习新任务的时候，不能访问旧任务，所以需要找到一个平衡点：既要对新任务又可塑性，又要保持旧任务的稳定性，文章中用stability-plasticity trade off表示。

同时引出最简单的方式就是保留old data distribution通过储存一部分旧training samples，但是这种方法受到资源的限制。另外的保留的方法在参数空间使用贝叶斯方法，将旧数据的信息通过参数的方式递推，但是上一轮的后验一般不可tractable，用一个可处理的分布近似。

一种方法是使用online Laplace approximation，另一种方法是使用online variational inference，第一种方式是把旧任务压缩成一个最优参数的高斯先验，并且在学习新任务的时候在loss中添加一个二次约束防止离旧参数更远，第二种方式直观上的理解就是使用一个KL散度的正则项，尽量将参数分布拴在上一步的后验附近。  

前面讲到的replay方法和贝叶斯方法（regularzation）都是反应在梯度上，那么引出optimization-based approach，这些方法直接在梯度层面进行优化（操控）。


这里也分成两种，一个是有old sample，核心思想：梯度内积大于0，使得新任务任务方向不会让旧loss升高，另一种是没有old sample，例如NCL：利用online Laplace的后验信息，在一个信任域中最小化当前损失，直观理解就是更新在不干扰旧任务方向的走，把参数往旧的解上拉。

optimization-based approach是在找所有任务的通用解，但是会带来严重的task间干扰，这样引出，Architecture-based approach，核心思想是不同部分分开学。通过设置task-specific parameters和task-sharing parameters，或者不显示的设置不同的参数。从task的角度上来考虑，变成了计算$p(IDt​=i∣Dt​,θ)∝p(Dt​∣IDt​=i,θ)p(IDt​=i∣θ)$，当前数据是什么任务，该任务对这个数据的解释能力是什么。

但是这样会有两个大问题，一个是模型的可拓展性，受限于任务参数的稀疏性以及复用性，另一个问题是任务预测的准确性，即专家选择的准确性。


## Generalizability Analysis
提到了之前的很多问题都是假设test set follow相似的distribution，CL要保证的是：1.同一任务里从 train → test  intra-task generalizability的泛化 2. 从旧任务到新任务，分布漂移的时候，任务间的泛化能力   

首先提出来的是second-order Taylor expansion，是用来评估最大的sacrifice of its performance ，这个方法提供了一个上界，并且指出flat minima的重要性，越小的$λ_{max}$，不敏感，越不怕参数的移动，更利于CL的稳定。引出了3种方法来找到flat minima：    
1. 不仅仅是在一个点上，而是在领域里都稳定，这个方法因为参数维度高，并且求max困难，常常用Hessian近似或者只延少数方向 
   1. 用model connectivity，找多个极小值，并且他们之间存在一个low-error path，这条路径就比较flat
> 这两个方法都是在optimization-based approach上做文章
1. 从数据的分布的角度上来讲，使用大规模的预训练数据，使得模型的本来泛化能力就强，

并且上届还有另一半，这一半是由任务的相似性得到的，又提到了NTK，表明共享参数可以让相似任务协同，但是如果不共享输出头，那么相似任务会让输出头的判别更容易被破坏

另外如果按照学习所有incremental task相当于在一个约束空间参数中学习，是一个NP-hard的问题，有几种缓解的方法：对应的就是 1. replay 2. regularzation 3. architecture

一个新的上届被提出，假设是一个参数让所有任务的表现都好，那么他的期望误差是小于  最优解加上一个泛化项，但是很多任务的共享参数空间是空集，所以假设变为了有k个参数空间，平均测试误差的上届就是：最优解 + Robustness（flatness相关项） + 任务分布差异 + 泛化项    


## Regularization-Based Approach
第一种是weight regularization：
这种方法通过添加二次项惩罚，决定了参数空间的“重要性”，通过fisher information matrix（FIM）（EWC），以及一些对quadratic penalty的修改。另一种是expansion-renormalization，不再是使用旧参数在每一步进行约束，而是在训练新模型之后用旧参数重整
        
第二种是function regularization：
使用knowledge distillation，这种方法通常结合了replay的思想，并且连续的bayes也相当于一种function regularization的方式，需要old training sample（called “coreset”）


## Replay-Based Approach
可以分为3种replay，第一种是experience replay：存储old sample，limited store space，针对这些有improve storage efficiency，在optimization的方法有使用replay，在KD也有使用replay，同时使用replay还会导致可能的overfitting。第二种是generative replay：通过生成一个额外的生成模型来replay generated data，通常非常难并且需要很多资源。第三种就是feature replay：这种方法会有严重的representation shift，文章中指出，从零开始的表征变化剧烈，**pretrain能够更robust，并且迁移到下游任务**

## Optimization-Based Approach
Optimization Base Approach一方面是在gradient projection上面做文章，一个明显的逻辑链是：**regularization和replay的最终目的都是在修正gradient，而gradient projection对应的是在参数空间的更新**

另一个方面是meta-learning：他的目标是获取一个data-driven bias，不要重头优化，模型学会是一种更新的方式在遇到新task的时候能很快适应并减少遗忘。还有从loss landscape方向解读的：从flat-minima入手。large-scale pretaining等方法遇到更少的CF，暗示这些方法在representations，parameter和task-specific error之间有特定联系

## Representation-Based Approach
第一种是self-supervised learning：这种方法能够获得更加robust的representation。

第二种是通过pre-training for downstream，同时提出关键核心：pre-training知识需要适配当前任务并且对未来任务保持泛化，有fixed backbone的方法和updatable backbone的方法，同时保持原始statistic。

第三种是continual pre-training，持续性的增加pretrain的数据进行continual pre-training，以适配下游任务。

## Architecture-Based Approach
之前的方法都是使用一套参数，显然会导致inter-task interference，这里根据模型机构是否改变区分为Parameter allocation和dynamic architecture。

Parameter allocation通过隔离不同任务的参数空间，但是参数空间有限，模型可能需要稀疏的选择参数，dynamically expanded方法可以动态增长网络，但是必须缓慢

Model decomposition可以理解为将task-sharing and task-specific放在模型不同处，Modular network使用并行的子网络或者子模块学习并且是不需要pre-defined，MOE架构是典型的这种。虽然在CF中有优势，但是在inter-task generalizability和Scalability中有缺点，需要有task identities这个可能会带来问题。

## Task-Agnostic Inference
显示世界遇到的都是CIL，对于CIL通常用replay和KD，以及data-free的方法，还有使用特征统计再分类。

## Scarcity of Labeled Data
现在研究的CL都是由完整的labeled data的，一些人研究labeled data的稀缺性，提出few-shot，新类的样本少的训练会很难学习到新的representation，会被之前学习到的结构支配，导致成为一种对于围绕旧representation的过拟合，从而对新的task不能够很好的泛化，从而产生遗忘。

另一种是在解耦representation和classifier，第一种是获取兼容并且可拓展的representation，另一种是获取adaptive classifier

还有unlabeled data的情况，使用Semi-Supervised Continual Learning，另一种是external unlabeled data，KD和data augmentation是常用方法，以及最后一种学习representation from unlabeled data。

## Generic Learning Paradigm
这种方式强调的是没有显示的任务切换，TFCL和OCL是典型的，一些方法学习special parameters在增长的架构中，另一些用experience replay，重点在memory buffer上

## Object Detection
Incremental Object Detection中的问题是，有多个目标同时出现，并且在新类的训练中，旧目标往往会被标记成背景或者没有被标注，最常用的是KD，能够记住旧目标

## Semantic Segmentation
这里的问题是Continual Semantic Segmentation都是像素级别的，挑战更大，并且也会出现之前的background shift问题，KD还是主要的方法，

## Observation of Current Trend
现在的CL从解决不会忘记的问题转化到了不仅要不会忘，而且要plasticity and inter-task generalizability

## Beyond Task Performance
之前的eval都是在task performance上讲述，现在转到了resource efficiency上，另一个方面就是privacy protection，FL非常适合CL以及Machine Unlearning中如何控制不应该遗忘的地方，同时提升robust的方法往往会用在CL的情况中

## Cross-Directional Prospect
Diffusion Model不仅提供了很好的replay方法，也是很好的CL的对象，Foundation Model的出现一方面解决了一些downstream task的能力，同时也需要新的机制来可以持续的学习，Embodied AI需要通过不断的交互，是一个天然的CL的场景，同样Neuroscience自身为CL提供很好的inspiration，因为biological learning本身就是一个自然的CL。

2. Problem Setup
    1. Figure 1(a)
3. Challenges
    1. Stability-Plasticity Trade-off: Figure 1(b)
        1. Stability: What is stability?
            
            Stablility 用通俗的话来说就是模型的抗遗忘能力，模型在学习新task的时候旧的知识能不能被保留，表现上来说就是旧任务的性能有没有下降
            
        2. Plasticity: What is plasticity?
            
            Plasticity指的是模型在面对新任务的时候能不能快速并且有效的学习到新知识
            
        3. Why we need care about their trade-off?
            
            这两者之间存在一种互相约束的关系：
            
            1. 太强的Stability会抑制模型参数的改变，正则的约束强，etc. 导致模型无法学习到新的知识
            2. 太强的Plasticity会任由模型自由改变参数，覆盖旧的知识
            
            我们需要找到一个trade off，使得模型能够让旧知识保留并且新知识能够吸收
            
        4. Ways to address stability-plasticity trade-off
            
            将整个任务建模成为一个概率模型，遗忘的问题根源是在学习新任务的时候，不能访问旧任务
            
            1. Replay-Based: Need huge resource
            2. Bayesian framework
                1. Laplace approximation（用二次约束防止新参数离旧参数更远）
                2. online variational inference （用KL将参数分布拴在上一步附近）
            3. gradient-based optimization
                1. 有old sample的方法
                2. 没有old sample的方法
            4. Architecture-base
                1. 显示的分离task-specific parameters和task-sharing parameters
                2. 不显示的设置不同的参数
    2. Generalizability
        1. What is generalizability?
            
            适应分布之间的差距的能力，通常分为intra-task generalizability和inter-task generalizability，intra-task: train → test 的泛化，inter-task: distribution shift 的泛化
            
        2. Why generalizability is important?
            
            之前的很多假设都是test set有相同的distribution，non-convex有不同的optimal，不同的optimal的泛化性不一样，并且模型需要应对的是增量任务带来的变化
            
        3. What is its difference from stability-plasticity trade-off?
            
            stability-plasticity trade-off关心的是记住旧知识和学习新知识之间的平衡，generalizability更关注学出来的解的质量问题
            
        4. Ways to address generalizability
            1. flat minima
                1. Flatness metric/Hessian approximation
                2. Model connectivity
                3. Well-distributed representations
            2. task discrepancy
                1. NTK
            3. Structure of parameter space
                1. Shared feasible region narrows as tasks grow
                2. NP hard
            4. Generalized bounds
                1. minimum loss + empirical risk
                2. minimum loss +  loss flatness + task discrepency + empirical risk
4. Method Categories
    1. Regularization-based
        1. weight regularzation: 衡量参数的“重要性”(Fisher)
        2. function regularzation: knowledge distillation
    2. Replay-based
        1. experience replay: 存old sample(limited store space) → improve storage efficiency
        2. generative replay: 额外的生成模型replay generated data(source needed)
        3. feature replay: 回放中间特征，但是有严重的representation shift，However，pretrain能够更robust，并且迁移到下游任务
    3. Optimization-based
        
        regularization和replay的最终目的都是在修正gradient
        
        1. gradient projection: 
        2. meta-learning: 获取一个data-driven bias，学会一种更新方式能够遇到新task很快适应
        3. loss landscape: flat minima
    4. Representation-Based Approach
        1. self-supervised learning: robust representation
        2. pre-training for downstream: 
            1. fixed backbone
            2. updatable backbone
        3. continual pre-training: 在不断到来的预训练数据上持续训练，再迁到下游任务
    5. Architecture-based
        1. Parameter allocation: 隔离不同任务的参数空间
            1. fix: sparsity constraints on parameter usage
            2. dynamic in size: slow
        2. Model  decomposition: task-sharing and task-specific parameters
        3. Modular network: parallel sub-networks or submodules，但是在inter-task generalizability和Scalability中有缺点，需要有task identities
5. Application Areas
    1. Task-Agnostic Inference: CIL in real world
        1. within-task prediction 
        2. task-identity prediction 
    2. Scarcity of Labeled Data: 假设labeled data稀缺
        1. few-shot labeled data
        2. Unlabelled data
    3. Generic Learning Paradigm:  TFCL and OCL
        1. learn specialized parameters in a growing architecture
        2. memory buffer
    4. Object Detection & Semantic Segmentation: background shift（KD）
6. Disscusion
    
    eval task preformance → resource efficiency, Privacy protection(FL), Machine unlearning,
    
    Diffusion→ generate replay, Foundation → downstream, Embodied → general CL, Neuroscience → inspiration