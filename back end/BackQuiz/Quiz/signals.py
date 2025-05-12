from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import now
from .models import Quiz, Result
from django.db.models import Sum

@receiver(post_save, sender=Quiz)
def mark_absent_students(sender, instance, created, **kwargs):
    if not created and instance.end_time and instance.end_time <= now():
        assigned_students = instance.assigned_students.all()
        submitted_students = Result.objects.filter(quiz=instance).values_list('student', flat=True)
        absent_students = assigned_students.exclude(id__in=submitted_students)

        for student in absent_students:
            # Calculate total points for the quiz
            total_points = instance.questions.aggregate(total_points=Sum('points'))['total_points'] or 0

            Result.objects.get_or_create(
                quiz=instance,
                student=student,
                defaults={
                    'score': 0,
                    'max_score': total_points,
                    'is_absent': True,
                }
            )