from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Quiz

@receiver(post_save, sender=Quiz)
def update_quiz_is_active(sender, instance, **kwargs):
    # Avoid recursion by checking if the field already has the correct value
    current_time = timezone.now()
    is_active = instance.is_published and instance.start_time <= current_time <= instance.end_time
    if instance.is_active != is_active:
        instance.is_active = is_active
        instance.save(update_fields=['is_active'])  # Avoid triggering another save