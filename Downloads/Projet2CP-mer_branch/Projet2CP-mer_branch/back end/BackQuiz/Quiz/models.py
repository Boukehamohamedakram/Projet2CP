from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL  # Reference the custom User model

class Group(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_groups')  # 🔥 fixed here
    students = models.ManyToManyField(
        User,
        related_name='student_groups',
        limit_choices_to={'role': 'student'}
    )

    def __str__(self):
        return f"{self.name} (by {self.teacher.username})"


class Quiz(models.Model):
    CATEGORY_CHOICES = (
        ('math', 'Mathematics'),
        ('science', 'Science'),
        ('history', 'History'),
        ('literature', 'Literature'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes')
    assigned_students = models.ManyToManyField(
        User, 
        related_name='assigned_quizzes',
        limit_choices_to={'role': 'student'},
        blank=True
    )
    assigned_groups = models.ManyToManyField('Group', related_name='quizzes', blank=True)
    time_limit = models.IntegerField(help_text="Time limit in minutes")
    is_published = models.BooleanField(default=False)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='math')
    max_attempts = models.PositiveIntegerField(default=1, help_text="Maximum number of attempts allowed per student")
    is_active = models.BooleanField(default=True)  # Ensure the field exists

    def save(self, *args, **kwargs):
        # Hardcode is_active to True
        self.is_active = True
        super().save(*args, **kwargs)


class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    attempt_number = models.PositiveIntegerField(default=1)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('quiz', 'student', 'attempt_number')
        
    def __str__(self):
        return f"{self.student.username} - Attempt #{self.attempt_number} on {self.quiz.title}"

class Question(models.Model):
    TYPE_CHOICES = (
        ('mcq', 'Multiple Choice'),
        ('tf', 'True/False'),
        ('text', 'Short Answer'),
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    points = models.PositiveIntegerField(default=1)  # Add points field with default value of 1

    def __str__(self):
        return self.text

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class StudentAnswer(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    text_answer = models.TextField(null=True, blank=True)  # For open-ended questions
    earned_points = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # For manual grading
    
    class Meta:
        unique_together = ('student', 'question')

    def __str__(self):
        return f"Answer by {self.student.username} for {self.question.text}"

class Result(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    completed_at = models.DateTimeField(auto_now_add=True)
    is_absent = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.quiz.title} - {self.score}/{self.max_score}"

    def calculate_score(self):
        """Calculates and updates the score based on the selected options."""
        correct_answers = StudentAnswer.objects.filter(
            student=self.student,
            question__quiz=self.quiz,
            selected_option__is_correct=True
        )
        total_score = sum(answer.question.points for answer in correct_answers)
        self.score = total_score
        self.save()
