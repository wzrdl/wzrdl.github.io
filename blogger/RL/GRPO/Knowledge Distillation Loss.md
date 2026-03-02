```python
import torch
import torch.nn.functional as F

def distillation_loss(
	student_logits: torch.Tensor,
	teacher_logits: torch.Tensor,
	temperature: float = 1.0
) -> torch.Tensor:
	"""
	Compute knowledge distillation loss using PyTorch.
	
	Args:
		student_logits: Logits from student model
		teacher_logits: Logits from teacher model
		temperature: Softmax temperature
		
	Returns:
		Distillation loss
	"""
	student_probs = F.softmax(student_logits / temperature, dim = -1)
	teacher_probs = F.softmax(teacher_logits / temperature, dim = -1)

	KL = torch.sum(teacher_probs * torch.log(teacher_probs / student_probs))

	return (temperature ** 2) * KL
```