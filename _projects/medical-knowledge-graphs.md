---
layout: page
title: Medical Knowledge Graphs
description: Knowledge graph pipelines for seizure semiology and epileptogenic-zone reasoning.
img: assets/img/publication_preview/kg_paradigm.png
importance: 1
category: research
related_publications: true
---

I work on medical knowledge graph pipelines that structure clinical seizure semiology and epileptogenic-zone relationships for analysis and reasoning.

Highlights:

- Built a medical GraphRAG pipeline combining Neo4j structural queries, FAISS dense retrieval, and QLoRA-based LLaMA-3 and Mistral-7B fine-tuning.
- Constructed probabilistic knowledge graphs from more than 10,000 clinical records.
- Modeled seizure propagation as an MDP trained with PPO-style reinforcement learning.

{% include figure.liquid loading="eager" path="assets/img/publication_preview/kg_paradigm.png" title="Knowledge graph construction pipeline" class="img-fluid rounded z-depth-1" %}
