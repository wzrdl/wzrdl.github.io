```python
def linear_lr_decay(initial_lr: float, end_lr: float, num_steps: int) -> list:
    """
    Generate a linear learning rate decay schedule.
    
    Args:
        initial_lr: Starting learning rate
        end_lr: Final learning rate
        num_steps: Total number of training steps
    
    Returns:
        List of learning rates for each step
    """
    if num_steps <= 0:
        return []
    if num_steps == 1:
        return [initial_lr]
    schedule = []
    for step in range(num_steps):
        lr = initial_lr + (end_lr - initial_lr) * (step / (num_steps - 1))
        schedule.append(lr)
    return schedule
```