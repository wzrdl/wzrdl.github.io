# Temperature

## Why do we need temperature?
LLM follows the rule of next token prediction, and temperature is an inference time parameter during token sampling, which rescales the logits before softmax:
$$pi(T)​=∑j​ezj​/Tezi​/T​$$

## How does it works?
When T = 1, the distribution stays the same, when T < 1, the distribution becomes sharper, so the generation is more determinitic. When T > 1, the distribution becomes flatter, so the generation is more diverse. Temperature does not change token ranking, it only change the confidence gaps. In practice, we usually used together with top-k or top-p.

## How does it different from top-k/top-p?
First, we need to know what is top-k and top-p in LLM inference time. Top-k sampling keeps the k most probable next tokens, renormoalizes their probabilities and sample from that set. Top-p keeps the smallest set of high-probability tokens whose cumulative probability exceeds threshold p. These 3 concepts all happens during inference time.

* Temperature only change distribution
* Top-k and Top-p truncate the support set(remove the tail)


## In real engineering angle
It is a task specific defaults:
search/ factual: Low T
code generation: Low T
story: Moderate or High T
tool calls/ sturctured json: Low T