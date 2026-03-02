```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class FFNBlock(nn.Module):
    def __init__(self, d_model, d_hidden, dropout_p=0.1):
        super().__init__()
        self.linear1 = nn.Linear(d_model, d_hidden)
        self.linear2 = nn.Linear(d_hidden, d_model)
        self.dropout = nn.Dropout(dropout_p)

    def forward(self, x):
        residual = x
        out = F.relu(self.linear1(x))
        out = self.linear2(out)
        out = self.dropout(out)
        out = out + residual
        return torch.round(out * 10000) / 10000
```