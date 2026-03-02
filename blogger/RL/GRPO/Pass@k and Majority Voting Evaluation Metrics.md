```python
import torch
from collections import Counter

def pass_at_1(responses_correct: torch.Tensor) -> float:
	"""
	Compute pass@1 using PyTorch.
	
	Args:
		responses_correct: Boolean tensor
		
	Returns:
		pass@1 score
	"""
	return responses_correct.float().mean().item()


def majority_voting(responses: list[str]) -> str:
	"""
	Return most common response. Ties broken arbitrarily.
	"""
	if not responses:
		raise ValueError("majority_voting requires at least one response")
	counts = Counter(responses)
	return counts.most_common(1)[0][0]

def pass_at_k(n: int, c: int, k: int) -> float:
	"""
	Unbiased pass@k: 1 - C(n-c, k)/C(n, k).
	Requires n >= k; n total samples, c correct.
	"""
	if c == 0:
		return 0.0
	if k > n:
		return 1.0  # cannot draw k from n; treat as "any correct in n" => pass
	if n - c < k:
		return 1.0  # every k-subset contains at least one correct
	result = 1.0
	for i in range(k):
		result *= (n - c - i) / (n - i)
	return 1.0 - result
```