```python
import torch

def compute_group_relative_advantage(rewards: torch.Tensor) -> torch.Tensor:
	"""
	Compute the Group Relative Advantage for GRPO using PyTorch.
	
	Args:
		rewards: 1D tensor of rewards for a group of outputs
		
	Returns:
		1D tensor of normalized advantages
	"""
	mean_r = rewards.mean()
	std_r = rewards.std(unbiased = False)

	if std_r == 0:
		return torch.zeros_like(rewards)
	return (rewards - mean_r) / std_r
```