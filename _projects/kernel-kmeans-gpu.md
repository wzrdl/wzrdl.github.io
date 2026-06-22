---
layout: page
title: Kernel K-Means GPU Accelerator
description: Sparse linear algebra and GPU-parallel SpMM for scalable clustering.
importance: 5
category: systems
---

This project accelerates kernel K-Means by reformulating update steps as sparse linear algebra operations.

Highlights:

- Reformulated kernel K-Means updates using sparse matrix operations.
- Implemented GPU-parallel SpMM computation.
- Achieved up to 8.3x speedup over a CUDA baseline on 100k-sample datasets.
