from django.db import models
from django.conf import settings

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

    def __str__(self):
        return self.title



class Question(models.Model):
    TYPE_CHOICES = (
        ('mcq', 'Multiple Choice'),
        ('tf', 'True/False'),
        ('text', 'Short Answer'),
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return self.text

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class StudentAnswer(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='student_answers')
    selected_option = models.ForeignKey(Option, null=True, blank=True, on_delete=models.SET_NULL)
    text_answer = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def is_correct(self):
        if self.question.question_type in ['mcq', 'tf'] and self.selected_option:
            return self.selected_option.is_correct
        return None

class Result(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='results')
    score = models.FloatField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    def calculate_score(self):
        correct_answers = self.student.answers.filter(question__quiz=self.quiz, selected_option__is_correct=True).count()
        total_questions = self.quiz.questions.count()
        self.score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        self.save()
