```python
import torch
from typing import List, Tuple, Union


def train_neuron(
    features: Union[List[List[float]], torch.Tensor],
    labels: Union[List[float], torch.Tensor],
    initial_weights: Union[List[float], torch.Tensor],
    initial_bias: float,
    learning_rate: float,
    epochs: int,
) -> Tuple[List[float], float, List[float]]:
    """
    Train a single neuron (sigmoid activation) with mean-squared-error loss.

    Returns (updated_weights, updated_bias, mse_per_epoch)
    — weights & bias are rounded to 4 decimals; each MSE value is rounded too.
    """
    X = torch.as_tensor(features, dtype=torch.float32)
    Y = torch.as_tensor(labels, dtype=torch.float32)
    w = torch.as_tensor(initial_weights, dtype=torch.float32)
    b = torch.as_tensor(initial_bias, dtype=torch.float32)

    n = Y.shape[0]
    mse_values: List[float] = []

    for _ in range(epochs):
        # Forward
        z = X @ w + b
        preds = torch.sigmoid(z)
        errors = preds - Y

        # MSE
        mse = torch.mean(errors ** 2).item()
        mse_values.append(round(mse, 4))

        sigma_prime = preds * (1 - preds)
        delta = (2.0 / n) * errors * sigma_prime

        grad_w = X.t() @ delta
        grad_b = delta.sum()

        w = w - learning_rate * grad_w
        b = b - learning_rate * grad_b

    updated_weights = [round(float(val), 4) for val in w.tolist()]
    updated_bias = round(float(b.item()), 4)
    return updated_weights, updated_bias, mse_values
```