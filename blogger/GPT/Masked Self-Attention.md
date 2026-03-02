```python
import numpy as np

def compute_qkv(X: np.ndarray, W_q: np.ndarray, W_k: np.ndarray, W_v: np.ndarray):
	"""
	Compute Query (Q), Key (K), and Value (V) matrices.
	"""
	return np.dot(X, W_q), np.dot(X, W_k), np.dot(X, W_v)

def masked_attention(Q: np.ndarray, K: np.ndarray, V: np.ndarray, mask: np.ndarray) -> np.ndarray:
	"""
	Compute masked self-attention.
	"""
	d_k = Q.shape[1]
	scores = np.matmul(Q, K.T) / np.sqrt(d_k)
	scores = scores + mask
	attention_weights = np.exp(scores - np.max(scores, axis = 1, keepdims = True))
	attention_weights = attention_weights / np.sum(attention_weights, axis = 1, keepdims = True)
	output = np.matmul(attention_weights, V)
	return output
```
```python
import torch

def compute_qkv(X: torch.Tensor, W_q: torch.Tensor, W_k: torch.Tensor, W_v: torch.Tensor):
    """
    Compute Query (Q), Key (K), and Value (V) matrices.
    """
    return torch.matmul(X, W_q), torch.matmul(X, W_k), torch.matmul(X, W_v)

def masked_attention(Q: torch.Tensor, K: torch.Tensor, V: torch.Tensor, mask: torch.Tensor) -> torch.Tensor:
    """
    Compute masked self-attention.
    """
    d_k = Q.shape[1]
    scores = torch.matmul(Q, K.T) / (d_k ** 0.5)
    scores = scores + mask
    attention_weights = torch.softmax(scores, dim = 1)
    return torch.matmul(attention_weights, V)
```