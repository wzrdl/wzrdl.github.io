# RoPE

## RoPE的由来
Transformer使用的是绝对位置编码，绝对位置编码的缺点是提供了固定的位置，没有办法解决两个词之间的相对位置关系，于是就有了RoPE旋转位置编码来解决相对位置关系，并且能在Q，K中自然的使用

## 推导
我们需要找到一个函数 $f(·,m)$，使得加入了相对位置信息之后，他们做点积的结果，只和他们的相对距离有关，
$$ \langle f(\mathbf{q}, m), f(\mathbf{k}, n) \rangle = g(\mathbf{q}, \mathbf{k}, m-n)$$

在点积运算中，能够将$mn$变成$m-n$的，有 $e^A \cdot e^{-B} = e^{A-B}$ 的完美性质，同时，在复数域的内积中，两个复向量的内积等于第一个复数乘以第二个复数的共轭的实部，我们想使用复数来找到最开始的公式的解决方法，同时复数域的公式有：$e^{i\theta} = \cos\theta + i\sin\theta$，然后我们假设有
$q = r_q e^{i\alpha}$，
$k = r_k e^{i\beta}$

并且加上位置信息之后：$\tilde{q} = q e^{im\theta} = r_q e^{i(\alpha + m\theta)}$，$\tilde{k} = k e^{in\theta} = r_k e^{i(\beta + n\theta)}$
代入上式可以得到：
$$Re(\tilde{q} \tilde{k}^*) = Re(r_q e^{i(\alpha + m\theta)} \cdot r_k e^{-i(\beta + n\theta)})$$
$$= Re(r_q r_k e^{i(\alpha - \beta + (m-n)\theta)})$$
$$= r_q r_k \cos(\alpha - \beta + (m-n)\theta)$$
在数学上，给一个二维向量乘以一个复数 $e^{im\theta}$（即在复平面上旋转角度 $m\theta$），完全等价于在这个二维向量前面乘以一个 $2 \times 2$ 的实数旋转矩阵。
前面的函数就可以表示为旋转矩阵乘$q$，这里的旋转矩阵就是：
$$\mathbf{R}_m = \begin{pmatrix} \cos m\theta & -\sin m\theta \\ \sin m\theta & \cos m\theta \end{pmatrix}$$
```python
def precompute_freqs_cis(
    dim : int,
    end : int = int (32 * 1024),
    rope_base : float = 1e6,
    rope_scaling : Optional[dict] = None):

    # freq = 1 / (rope_base ** (2i / dim))
    freqs = 1.0 / (rope_base ** (torch.arange(0, dim, 2)[: (dim // 2)].float() / dim))
    if rope_scaling is not None:
        origin_max, factor, beta_fast, beta_slow =(
            rope_scaling.get("orginal_max_position_embeddings", 2048),
            rope_scaling.get("factor", 4),
            rope_scaling.get("beta_fast", 4.0),
            rope_scaling.get("beta_slow", 1.0)
        )
        # YaRN 
        if end / origin_max > 1.0:
            corr_dim = next((i for i in range(dim // 2) if 2 * math.pi / freqs[i] > origin_max), dim // 2)
        power = torch.arange(0, dim // 2, device = freqs.device).float() / max(dim // 2 - 1, 1)
        beta = beta_slow + (beta_fast - beta_slow) * power
        scale = torch.where(
            torch.arange(dim // 2, device = freqs.device) < corr_dim,
            (beta * factor - beta + 1) / (beta * factor),
            1.0 / factor
        )
        freqs = freqs * scale
    
    t = torch.arange(end, device = freqs.device)
    freqs = torch.outer(t, freqs).float()

    freqs_cos = torch.cat([torch.cos(freqs), torch.cos(freqs)], dim = -1)
    freqs_sin = torch.cat([torch.sin(freqs), torch.sin(freqs)], dim = -1)
    return freqs_cos, freqs_sin

def apply_rotary_pos_emb(q, k, cos, sin, position_ids = None, unsqueeze_dim = 1):
    def rotate_half(x):
        return torch.cat((-x[..., x.shape[-1] // 2:], x[..., : x.shape[-1] // 2]), dim = -1)
        q_embed = (q * cos.unsqueeze(unsqueeze_dim)) + rotate_half(q) * sin.unsqueeze(unsqueeze_dim)
        k_embed = (k * cos.unsqueeze(unsqueeze_dim)) + rotate_half(k) * sin.unsqueeze(unsqueeze_dim)
        return q_embed, k_embed       
```