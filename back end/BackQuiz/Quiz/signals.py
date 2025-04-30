from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import now
from .models import Quiz, Result

@receiver(post_save, sender=Quiz)
def mark_absent_students(sender, instance, created, **kwargs):
    # Only run if the quiz has ended
    if instance.end_time and instance.end_time <= now():
        if not created:  # Ensure this is not triggered on quiz creation
            # Get all assigned students
            assigned_students = instance.assigned_students.all()
            submitted_students = Result.objects.filter(quiz=instance).values_list('student', flat=True)

            # Find students who did not submit the quiz
            absent_students = assigned_students.exclude(id__in=submitted_students)

            # Mark them as absent
            for student in absent_students:
                Result.objects.create(quiz=instance, student=student, is_absent=True)