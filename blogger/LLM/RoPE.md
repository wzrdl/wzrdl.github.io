# RoPE

```python
def precompute_freqs_cis(
    dim : int,
    end : int = int (32 * 1024)
    rope_base : float = 1e6,
    rope_scaling : Optional[dict] = None):

    # freq = 1 / (rope_base ** (2i / dim))
    freqs = 1.0 / (rope_base ** (torch.arange(0, dim, 2)[: (dim // 2)].float() / dim))
```