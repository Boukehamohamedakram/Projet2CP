from rest_framework import serializers
from .models import Quiz, Question, Option, StudentAnswer, Result, Group, User, QuizAttempt
from django.contrib.auth import get_user_model
User = get_user_model()  # ✅ Fetch the actual User model dynamically


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']
        

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, required=True)  # Nested options

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'question_type', 'points', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        question = Question.objects.create(**validated_data)

        # Create options for the question
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)

        return question
    
class GroupSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.filter(role='student')
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'teacher', 'students']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    assigned_students = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.filter(role='student'),
        required=False
    )
    assigned_groups = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Group.objects.all(),
        required=False
    )

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'teacher',
            'assigned_students', 'assigned_groups',
            'time_limit', 'is_published', 'category', 'questions',
            'start_time', 'end_time', 'is_active', 'max_attempts'
        ]

    def create(self, validated_data):
        # Extract assigned students and groups from the request
        assigned_students = validated_data.pop('assigned_students', [])
        assigned_groups = validated_data.pop('assigned_groups', [])

        # Automatically set the teacher field from the request user
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['teacher'] = request.user

        # Create the quiz instance
        quiz = Quiz.objects.create(**validated_data)

        # Manually set assigned students and groups
        quiz.assigned_students.set(assigned_students)
        quiz.assigned_groups.set(assigned_groups)

        return quiz

    def update(self, instance, validated_data):
        # Extract assigned students and groups from the request
        assigned_students = validated_data.pop('assigned_students', None)
        assigned_groups = validated_data.pop('assigned_groups', None)

        # Update quiz attributes
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Manually update assigned students and groups
        if assigned_students is not None:
            instance.assigned_students.set(assigned_students)
        if assigned_groups is not None:
            instance.assigned_groups.set(assigned_groups)

        instance.save()
        return instance

class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ['id', 'student', 'question', 'selected_option', 'text_answer']

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'quiz', 'student', 'score', 'completed_at']


class StudentQuizHistorySerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    quiz_description = serializers.CharField(source='quiz.description', read_only=True)
    question_count = serializers.SerializerMethodField()
    answered_count = serializers.SerializerMethodField()
    percentage_score = serializers.SerializerMethodField()
    max_attempts = serializers.IntegerField(source='quiz.max_attempts', read_only=True)
    can_retake = serializers.SerializerMethodField()
    
    class Meta:
        model = Result
        fields = [
            'id', 'quiz_id', 'quiz_title', 'quiz_description',
            'score', 'max_score', 'percentage_score',
            'question_count', 'answered_count', 'completed_at',
            'attempts_used', 'max_attempts', 'can_retake']
    
    
    
    def get_question_count(self, obj):
        return obj.quiz.questions.count()
    
    def get_answered_count(self, obj):
        return StudentAnswer.objects.filter(
            student=obj.student,
            question__quiz=obj.quiz
        ).count()
    
    def get_percentage_score(self, obj):
        if obj.max_score > 0:
            return round((obj.score / obj.max_score) * 100, 2)


        return 0
    
    def get_attempts_used(self, obj):
        return QuizAttempt.objects.filter(
            quiz=obj.quiz,
            student=obj.student,
            is_completed=True
        ).count()
    
    def get_can_retake(self, obj):
        attempts_used = self.get_attempts_used(obj)
        return attempts_used < obj.quiz.max_attempts and obj.quiz.is_active

class QuizResultDetailSerializer(serializers.ModelSerializer):
        percentage = serializers.SerializerMethodField()
    
        class Meta:
            model = Result
        fields = ['id', 'quiz', 'student', 'score', 'max_score', 
                  'percentage', 'completed_at']
    
        def get_percentage(self, obj):
            if obj.max_score > 0:
                return round((obj.score / obj.max_score) * 100, 2)
            return 0