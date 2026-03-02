```python
import torch

def grpo_objective(rhos, A, pi_theta_old, pi_theta_ref, epsilon=0.2, beta=0.01) -> torch.Tensor:
    """
    Compute the GRPO objective function.

    Args:
        rhos: List of likelihood ratios (pi_theta / pi_theta_old).
        A: List of advantage estimates.
        pi_theta_old: List of old policy probabilities.
        pi_theta_ref: List of reference policy probabilities.
        epsilon: Clipping parameter for the surrogate objective.
        beta: KL divergence penalty coefficient.

    Returns:
        The computed GRPO objective value as a torch.Tensor.
    """
    rhos = torch.as_tensor(rhos, dtype = torch.float64)
    A = torch.as_tensor(A, dtype = torch.float64)
    pi_theta_old = torch.as_tensor(pi_theta_old, dtype = torch.float64)
    pi_theta_ref = torch.as_tensor(pi_theta_ref, dtype = torch.float64)

    clipped_rhos = torch.clamp(rhos, 1 - epsilon, 1 + epsilon)
    surr1 = A * rhos
    surr2 = A * clipped_rhos
    min_terms = torch.minimum(surr1, surr2)

    pi_theta = rhos * pi_theta_old
    pi_theta = torch.clamp(pi_theta, min = 1e-10)
    pi_theta_ref = torch.clamp(pi_theta_ref, min = 1e-10)

    ratio = pi_theta_ref / pi_theta
    KL_term = ratio - torch.log(ratio) - 1
    KL_divergence = rhos * KL_term

    obj = torch.mean(min_terms - beta * KL_divergence)
    return obj
```