# Activate Function

## Why we need the activate function?
It introduce nonlinearity, let NN model complex pattern rather than behaving like linear regression.

## How we solve?

### Sigmoid
when x is large in magnitude, cause vanishing gradients.
$$\sigma(x) = \frac{1}{1 + e^{-x}}$$
$$\sigma'(x) = \sigma(x)\,(1 - \sigma(x))$$

### Tanh
$$\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$$
$$\frac{d}{dx}\tanh(x) = 1 - \tanh^2(x)$$

still suffer saturation and vanishing gradients

### ReLU
$$\mathrm{ReLU}(x) = \max(0, x)$$
$$
\mathrm{ReLU}'(x) =
\begin{cases}
1, & x > 0 \\
0, & x \le 0
\end{cases}
$$
Hard threshold, simple but not smooth. For negative inputs, gradient is zero which cause dead neurons.

### GELU
GELU(x)=xΦ(x)
dxd​GELU(x)=Φ(x)+xϕ(x)
GELU use soft stochastic-style gating, small negative values are lightly suppressed. Normally used in BERT.

### Swish / SiLU
SiLU(x)=xσ(x)
dxd​SiLU(x)=σ(x)+xσ(x)(1−σ(x))

### SwiGLU
Based on Gated activation, Gated activation usually create two branches and combines them multiplicatively. Let the model keeps the origin data information(linear way), and represent content seperately. Avoiding gradient vanishing and so on empirical performance.
SwiGLU(a,b)=SiLU(a)⊙b

```python
# https://github.com/meta-llama/llama3/blob/11817d47e1ba7a4959b025eb1ca308572e0e3963/llama/model.py#L193
class FeedForward(nn.Module):
    def __init__(
        self,
        dim: int,
        hidden_dim: int,
        multiple_of: int,
        ffn_dim_multiplier: Optional[float],
    ):
        super().__init__()
        hidden_dim = int(2 * hidden_dim / 3)
        # custom dim factor multiplier
        if ffn_dim_multiplier is not None:
            hidden_dim = int(ffn_dim_multiplier * hidden_dim)
        hidden_dim = multiple_of * ((hidden_dim + multiple_of - 1) // multiple_of)

        self.w1 = ColumnParallelLinear(
            dim, hidden_dim, bias=False, gather_output=False, init_method=lambda x: x
        )
        self.w2 = RowParallelLinear(
            hidden_dim, dim, bias=False, input_is_parallel=True, init_method=lambda x: x
        )
        self.w3 = ColumnParallelLinear(
            dim, hidden_dim, bias=False, gather_output=False, init_method=lambda x: x
        )

    def forward(self, x):
        # in SwiGLU, the Swish function is used to gate the linear function of GLU
        # swish(x) = x * sigmoid(beta * x)
        # when beta = 1, swish function becomes same as the sigmoid linear unit function (SiLU)
        return self.w2(F.silu(self.w1(x)) * self.w3(x))
```
