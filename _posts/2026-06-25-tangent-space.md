---
layout: post
title: "Tangent Vectors as Derivations"
date: 2026-06-25 00:00:00-0400
description: A note on tangent vectors, directional derivatives, and derivations at a point.
tags: mathematics geometry manifolds
categories: notes
---

# Tangent Vectors in $\mathbb{R}^{n}$ as Derivations

## Why we need the Directional Derivative?

When we first think of the tangent vector at a point in 3D space, for example, a balloon. We think of a straight hard "arrow" pointing outward from this point.

When we want to study an manifold, (a high-dimensional hypersurface, the projective space $\mathbb{R}\mathbb{P}^n$), the manifold itself my not be embedded in a large Euclidean space. Since there is no larger Euclidean space surrounding them, their is simply no external "space" and no definition of "sticking out".

![Tangent space](/assets/img/manifold/tangent_space.png)

Here we have the definition of the Directional Derivative, First we have to clarify some definition. A point $p = (p^1, \dots, p^n)$ in $\mathbb{R}^n$, with direction $v = \langle v^1, \dots, v^n \rangle$ in $\mathbb{R}^n$, has parametrization:
$$c(t) = (p^1 + tv^1, \dots, p^n + tv^n)$$
we have:
$$D_v f = \lim_{t \to 0} \frac{f(c(t)) - f(p)}{t} = \left. \frac{d}{dt} \right|_{t=0} f(c(t))$$
By chain rule:
$$D_v f = \sum_{i=1}^n \frac{dc^i}{dt}(0) \frac{\partial f}{\partial x^i}(p) = \sum_{i=1}^n v^i \frac{\partial f}{\partial x^i}(p)$$
We usually written:
$$D_v = \left. \sum_{i=1}^n v^i \frac{\partial \quad}{\partial x^i} \right|_p$$

Overall, the different in Differential Geometry with Euclidean space is the coordinate system.

## Derivations at a Point

Before Derivations at a point, we have to introduce a definition called **Germ**, which satisfies the properties of the algebra for further calculation.

All the content we talk about later are the transformation from a Geometry perspective to algebra system. We can say that It transforms the "tangent vector" from an "arrow" in geometric intuition into a linear operator that differentiates functions in the algebraic sense.

We have a map for: $D: C^\infty_p \to \mathbb{R}$, and $D_v$ is $\mathbb{R}$-linear and satisfies the Leibniz rule:
$$D_v(fg) = (D_v f)g(p) + f(p)D_v g$$
And the core idea can be written as:
$$\phi : T_p(\mathbb{R}^n) \to \mathcal{D}_p(\mathbb{R}^n)$$
$$v \mapsto D_v = \left. \sum v^i \frac{\partial \quad}{\partial x^i} \right|_p$$
which is an isomorphism of vector spaces.
