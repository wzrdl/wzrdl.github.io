## 1）你的网站现在最该补的内容（从“像简历”升级为“能转化面试”的作品集）

### A. 首页（Home）必须具备的 6 个模块（任务清单）

1. **Hero（3 秒定位）**

   * 一句话定位：ML Engineer / Applied AI / LLM Systems + RL + RAG
   * 3 个关键词：LLM Systems、RAG/GraphRAG、RL for decision modeling
   * 2 个 CTA 按钮：`Download Resume` / `View Projects`
2. **Featured Projects（精选 6 个）**

   * 只放最能打的：Smarter Doctor Agent、Recommendation Service、Clinical Epilepsy QA（GraphRAG）、Seizure Trajectory RL、Kernel K-Means CUDA、3D-visual
3. **Experience Snapshot（3 条卡片）**

   * IntelliSys Lab / Brain Imaging & Graph Learning Lab / Siemens
4. **Publications（带状态）**

   * Under review / Accepted / Conference
5. **Skills（按能力栈分组，不要堆关键词）**

   * LLM & Training / Serving & LLMOps / Data & Platform / SWE
6. **Contact + Links**

   * Email / LinkedIn / GitHub / Google Scholar（如有）/ Resume PDF

> 这些信息你简历里都有核心素材：两段 RA + Siemens 实习 + Publications + Projects。

---

### B. Projects 页面：建议做成“可筛选的项目库”（你说要摆出所有项目）

你现在 repo 有 **23 个**。([GitHub][1])

### C. Experience 页面：把“简历 bullet”扩成“作品集叙事”

你要写更详细一点，这里最关键的是：

* 每段经历补齐：**背景/目标 → 你做了什么 → 产出/指标 → 工程化能力（可复现/可部署/可评测）**
* 放“你真正写过/跑过/部署过”的东西：Neo4j、GraphRAG、FAISS、QLoRA、PPO-style 等（简历已写）。

---

## 2t 直接开工）

### Phase 0：基础信息与入口

* [ ] 在首页顶部加入：**Resume PDF 下载按钮 + GitHub + LinkedIn**
* [ ] 在 /assets 放：头像、项目架构图、项目 demo GIF（至少 6 个 featured 各 1 张）
* [ ] 加 SEO：title / description / og:image（社交分享卡片）

### Phase 1：信息架构与导航

* [ ] 顶部导航：Home / Projects / Experience / Publications / Blog / Contact
* [ ] Projects 支持 tag filter（JS 简单实现即可）

### Phase 2：Experience（重点）

* [ ] IntelliSys Lab：补到 5–7 条 bullets（含“评测、可视化、可复现”）
* [ ] Brain Imaging Lab：拆成两个小项目块（Clinical Epilepsy QA & Seizure Trajectory RL），每块 4–6 bullets
* [ ] Siemens：强调数据质量、自动化、可复用模板、SQL pipeline

### Phase 3：Projects（你要“所有项目都摆出来”）

* [ ] 建一个 `projects.json` 或 `projects.yml`

  * 字段：title / year / tags / one_liner / highlights[] / tech[] / links
* [ ] Featured 6 个项目：每个补 1 张图 + 3–5 bullets + 结果指标
* [ ] All Projects 23 个：每个至少 1 句话 + 2–3 个亮点 + tech

### Phase 4：Publications & Research

* [ ] Publications 列表按状态分区：

  * Accepted（Scientific Reports 2025）
  * Under review（KG-based RL seizure propagation 2025；Prompt optimization 2024）
  * Conference（SPIE CCPCDL 2022）

* [ ] 每篇 pF/项目链接

### Phase 5：工程可信度（“像能上产线”）

* [ ] 每个 featured 项目加：

  * “How to run”（最小复现）
  * “System design”（模块图）
  * “Evaluation”（你怎么测的）
* [ ] 加一个 “Playground / Notes” 页：记录你在 vLLM、KV cache、block manager 等系统学习产出（对 LLM infra 面试很加分）

---

# 3）可直接粘贴到网站的文案（Experience 更详细版）

> 下面是**中文叙事 + 英文标题**的写法（网站更有故事性）。你如果网站全英文，我也可以把同一份改成英文版。

---

## Experience

### Research Assistant — Intelligent System (IntelliSys) Lab, Stevens Institute of Technology（Nov 2025 – Present）

**Forgetting Score Guided Continual Post-Training for LLMs** 

* 围绕“**LLing）中的灾难性遗忘**”问题，设计并实现训练期监控指标 **Forgetting Score**，将**loss non-quadraticity、Hessian spectrum curvature scale、parameter update misalignment**等信号融合为可追踪的遗忘强度刻画，用于定位“从哪一步开始忘、忘了什么类型能力”。
* 将遗忘监控做”，支持按 step/epoch 记录指标曲线、导出日志并进行可视化对比（不同数据配比/不同训练阶段/不同 LoRA 配置）。
* 以“指标→策略”的方式探索缓解方案：用 Forgetting Score 作为信号，指导 continual post-training 的训练调度/采样/正则方向，形成一套可复现实验框架，便于后续论文实验扩展与 ablation。
* 产出：为后续研究提供统一的遗忘度量与对比基准，支撑“量化 + 缓解”两条线并行推进。

---

### Research Assistant — Brain Imaging & Graph Learning Lab, Stevens Institute of Technology（Nov 2024 – Present）

#### Clinical Epilepsy QA（KG + Dense RAG, LoRA Fine-tuning）

* 构建从 **等关系的 pipeline，并将结构化结果以 **Neo4j 知识图谱**形式服务于医疗问答 grounding。
* 实现 **G检索，同时结合 **FAISS dense retrieval** 做语义召回，将图与向量检索整合为统一的 evidence 组装流程。
* 基于检索增强/ Mistral-7B**，在内部基准上实现 **factual consistency +20%**（相对 baseline）。
* 强调可评测：归测试，确保模型与检索策略更新后效果稳定。

#### Seizure Trajectory Reinforcement Learning Modeling 

* 将癫痫发作进tions），设计 reward 偏好“**早预测 + 稳定预测**”以适配 partial observation 的临床场景。
* 使用 PPOturn 上取得 **+40%** 提升，并提升跨病人泛化（相对基线 MC 方法）。

---

##— Siemens（Nov 2023 – Mar 2024）

* 构建可复用 Excel 模板用于每周数据更新：schema 标准化、KPI 定义、自动汇总表，并编写基础 SQL 生成分析就绪数据集。
* 实现多表/多spot audit），减少报表口径不一致与手工核对成本，提升周报稳定性。

---

# 你 GitHub 23 个 repo）

> 你 repo 列表显示共 23 个。([GitHub][1])
> 我按“项目库”写法给你：**一行简介 + 亮点 bullets + Tech**。Featured 的我写得更“作品集化”；其余保持简洁但有含金量。

---

## Featured Projects（建议首页/Projects 置顶）

### 3D Model Generator & Cloud Library（`3D-visual`）

**一款桌面端 3D 模型浏览/查看器（PyQt + PyVista），后端用 FastAPI 管理云端模型库，并接入 Meshy API 做 Text-to-3D。** ([GitHub][2])

* Desktop Client：本地图库浏览、3D Viewer、AI 生成入口（HTTP 调后端）。([GitHub][2])
* Backend：FastAPI + SQLite + Google Cloud Storage 统一管理元数据与模型文件，支持按需下载与缓存。([GitHub][2])
* 强调工程结构：前后端目录分离、环境变量模板、清晰的模块划分（viewer / scene viewer / client data manager）。([GitHub][2])
  **Tech**：Python, PyQt, PyVista, FastAPI, SQLite, GCS, Meshy API

---

### Popcorn: GPU-Accelerated Kernel K-Means（`Kernel-k-means-cuda`）

**基于 CUDA 的 kernel k-means 高性能实现，利用稀疏线性代数（cuBLAS/cuSPARSE）加速非线性聚类。** ([GitHub][3])

* 以矩阵计算重写 kernel k-means：CSR 稀疏矩阵 + SpMM/SpMV 作为核心算子。([GitHub][3])
* GPU 加速：使用 CUDA、cuBLAS、cuSPARSE，并结合自定义 kernel 做聚类赋值等关键步骤优化。([GitHub][3])
* 适用于非线性簇（如同心圆），README 中给出完整原理与实现路径。([GitHub][3])
  **Tech**：CUDA, C/C++, cuBLAS, cuSPARSE, Sparse Linear Algebra

---

### Automatic Prompt Optimization for Medical Prompts（`Automatic-prompt-optimization-for-medical-prompts`）

**面向医疗数据集的自动 prompt 优化：文本梯度下降 + momentum，并引入 Bayesian reverse validation 做评估。** ([GitHub][4])

* 方法：text-based gradient descent + momentum，迭代提升 prompt 质量。([GitHub][4])
* 评估：Bayesian reverse validation 衡量 prompt 有效性并增强推理能力。([GitHub][4])
* 工程：LangChain 编排、API 调用与本地模型部署探索；附带论文 PDF。([GitHub][4])
  **Tech**：Python, LangChain, Bayesian methods, LLM APIs / local LLM

---

### Prompt Optimizer（Full-Stack）（`automatic_fullstack`）

**一个带前后端的 Prompt 优化工具：前端交互式迭代，后端提供优化逻辑与历史记录。** ([GitHub][5])

* 前后端一体：frontend + backend 组成完整 prompt optimization solution。([GitHub][5])
* 支持实时反馈与历史追踪（README 列出 features 与完整运行方式）。([GitHub][5])
  **Tech**：TypeScript/Next.js, Python/Flask, PostgreSQL

---

### Liar’s Bar Game — Game Theory Analysis（`Liar-s-Bar`）

**两人不完全信息博弈的仿真与分析：Nash equilibrium、Bayesian belief updates、backward induction。** ([GitHub][6])

* 将 bluffing + sequential decision 建模为可模拟的策略空间，比较 Bayesian vs non-Bayesian 策略。([GitHub][6])
  **Tech**：Python, Simulation, Game Theory

---

### MiniMind / MiniMind-V（`minimind`, `minimind-v`，fork）

**从 0 训练超小参数 LLM/VLM 的完整流程复现（含 pretrain/SFT/LoRA/RL 等），用于学习与实验。** ([GitHub][7])

* `minimind`：目标是从 0 训练 ~26M 级别小 GPT，并覆盖预训练到 RL 的全流程代码（原仓库说明）。([GitHub][7])
* `minimind-v`：从 0 训练 ~26M 视觉语言模型，作为 MiniMind 视觉能力拓展（原仓库说明）。([GitHub][8])
  **Tech**：PyTorch, LLM/VLM training pipeline, LoRA/RL (学习向)

---

## All Projects（完整项目库：按类别）

### LLM Systems / Serving

#### `mini-vllm`

**极简 vLLM/LLM serving 实验工程**（用于研究 KV cache、block 管理、调度等推理系统组件）。该仓库近期仍在更新。([GitHub][1])
**Tech**：Python, LLM inference systems（KV cache / scheduling）

#### `nano-vllm`（fork）

**Nano vLLM（轻量推理框架）fork，用于阅读/改造/对比实验。** ([GitHub][1])
**Tech**：Python, vLLM-style inference (学习向)

---

### LLM Alignment / Continual Learning / RL

#### `LLM-forgetting`

**持续后训练中的遗忘监控与缓解实验代码**：对应你在 IntelliSys Lab 做的 forgetting score 方向。 ([GitHub][1])
**Tech**：PyTorch, Continual post-training, metrics/monitoring

#### `Miniagent`

**Mini RL agent framework**：一个轻量 agent 框架（工具调用/策略循环/实验环境等）。([GitHub][1])
**Tech**：Python, RL/Agents, tool orchestration

---

### RAG / GraphRAG / Healthcare

#### Clinical Epilepsy QA（建议作为站内项目页，不只挂 repo）

**KG + Dense RAG + QLoRA 微调的医疗问答**：Neo4j GraphRAG + FAISS dense retrieval + QLoRA 微调 LLaMA-3/Mistral-7B，factual consistency +20%。
**Tech**：Neo4j, Cypher, FAISS, QLoRA, LLaMA-3, Mistral-7B

#### Seizure Trajectory RL（建议作为站内项目页）

**semiology transitions MDP + PPO-style**：设计偏好早且稳的 reward，predictive return +40%。
**Tech**：RL/MDP, PPO-style training

#### `RAG_local`

**本地 RAG 实验仓库**：用于搭建本地检索增强问答与评测对比（更适合放“Notes/Playground”栏目）。([GitHub][1])
**Tech**：Python, RAG（本地实验）

---

### Recommender Systems / MLOps

#### Recommendation Service（`Recommendation-service`）

**实时推荐系统（AWS）**：Kafka + Feast + Redis 特征，FastAPI 服务 XGBoost，并包含自动化训练/部署、MLflo ([GitHub][1])
**Tech**：Kafka, Feast, Redis, FastAPI, XGBoost, MLflow, Optuna, Airflow, Kubernetes, AWS

---

### Computer Vision / Segmentation

#### `sam3`（fork）

**Meta Segment Anything Model 3（SAM 3）fork**：用于推理/微调实验与 notebook 验证。([GitHub][1])
**Tech**：PyTorch, segmentation（学习向）

#### `Apex-yolo`

**YOLO 相关目标检测实验仓库**（建议补 README：数据、训练命令、效果图）。([GitHub][1])
**Tech**：Python, YOLO/detection

---

### 3D Generation (forks)

#### `shap-e`（fork）

**OpenAI Shap-E fork**：text/image([GitHub][1])

#### `dreamgaussian`（fork）

**DreamGaussian fork**：Generative Gaussian Splatting for 3D content creation（学习与工程复现）。([GitHub][1])

---

### Web / Mobile / Misc

#### `**（建议把 Projects/Experience/Blog 都数据驱动化）。([GitHub][1])

#### `Page`

**Vue 项目/页面工程**（建议补：用途、预览截图、线上 demo）。([GitHub][1])

#### `ClimbHub`

**Swift iOS 项目**（建议补：功能点、UI 截图、架构、数据存储方式）。([GitHub][1])

#### `code_handwritten`

**手写相关/笔记型代码仓库**（建议整理成“Notes / Coursework”）。([GitHub][1])

#### `Covid-19-machine-learning`

**COVID-19 机器学习项目**：与你简历里的 SPIE CCPCDL 2022 论文方向可互相链接。([GitHub][1])

#### `baby-llama2-chinese`（fork）

**小参数中文 LLaMA2 训练（预训练 + SFT）fork**：用于学习/跑通流程。([GitHub][1])

---




[1]: https://github.com/wzrdl?tab=repositories "wzrdl (wzrdl) / Repositories · GitHub"
[2]: https://github.com/wzrdl/3D-visual "GitHub - wzrdl/3D-visual"
[3]: https://github.com/wzrdl/Kernel-k-means-cuda "GitHub - wzrdl/Kernel-k-means-cuda"
[4]: https://github.com/wzrdl/Automatic-prompt-optimization-for-medical-prompts "GitHub - wzrdl/Automatic-prompt-optimization-for-medical-prompts"
[5]: https://github.com/wzrdl/automatic_fullstack "GitHub - wzrdl/automatic_fullstack"
[6]: https://github.com/wzrdl/Liar-s-Bar "GitHub - wzrdl/Liar-s-Bar"
[7]: https://github.com/wzrdl/minimind "GitHub - wzrdl/minimind:  「大模型」2小时完全从0训练26M的小参数GPT！ Train a 26M-parameter GPT from scratch in just 2h!"
[8]: https://github.com/wzrdl/minimind-v "GitHub - wzrdl/minimind-v:  「大模型」1小时从0训练26M参数的视觉多模态VLM！ Train a 26M-parameter VLM from scratch in just 1 hours!"
