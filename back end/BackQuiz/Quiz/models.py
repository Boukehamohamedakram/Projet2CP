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

    
    @property
    def is_active(self):
        """Check if the quiz is currently active based on time"""
        now = timezone.now()
        
        # If no start/end times are set, quiz is always active
        if not self.start_time and not self.end_time:
            return True
            
        # If only start_time is set
        if self.start_time and not self.end_time:
            return now >= self.start_time
            
        # If only end_time is set
        if not self.start_time and self.end_time:
            return now <= self.end_time
            
        # If both are set
        return self.start_time <= now <= self.end_time

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

class Result(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    completed_at = models.DateTimeField(auto_now=True)
    is_absent = models.BooleanField(default=False)  # Field to track absentees

    class Meta:
        unique_together = ('quiz', 'student')
        
    def calculate_score(self):
        """Calculate the score based on correct answers and question points"""
        student_answers = StudentAnswer.objects.filter(
            question__quiz=self.quiz,
            student=self.student
        )
        
        total_points = 0
        earned_points = 0
        
        # Calculate total possible points for the quiz
        for question in self.quiz.questions.all():
            total_points += question.points
        
        # Calculate earned points from correct answers
        for answer in student_answers:
            if answer.question.question_type in ['mcq', 'tf']:
                if answer.selected_option and answer.selected_option.is_correct:
                    earned_points += answer.question.points
            # For open-ended questions, use the manually assigned score
            elif answer.question.question_type == 'open':
                earned_points += answer.earned_points
        
        self.score = earned_points
        self.max_score = total_points
        self.save()
        
        return self.score, self.max_score
