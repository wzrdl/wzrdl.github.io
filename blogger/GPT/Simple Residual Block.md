```python
import torch

def residual_block(x: torch.Tensor, w1: torch.Tensor, w2: torch.Tensor) -> torch.Tensor:
    """
    Implement a simple residual block with shortcut connection.
    
    Args:
        x: 1D input tensor
        w1: First weight matrix
        w2: Second weight matrix
    
    Returns:
        Output tensor after residual block processing
    """
    y = torch.matmul(w1, x)
    y = torch.relu(y)
    y = torch.matmul(w2, y)
    y = y + x
    y = torch.relu(y)
    return y
```