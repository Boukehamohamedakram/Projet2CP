from rest_framework import serializers
from .models import Quiz, Question, Option, StudentAnswer, Result,Group, User
from django.contrib.auth import get_user_model
User = get_user_model()  # ✅ Fetch the actual User model dynamically


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'question_type', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        question = Question.objects.create(**validated_data)

        # Ensure MCQ & True/False have at least one correct option
        if question.question_type in ['mcq', 'tf']:
            if not any(option['is_correct'] for option in options_data):
                raise serializers.ValidationError("At least one correct option is required for MCQ/TF.")

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
            'time_limit', 'is_published', 'category', 'questions'
        ]

    def create(self, validated_data):
        # Extract assigned students and groups from the request
        assigned_students = validated_data.pop('assigned_students', [])
        assigned_groups = validated_data.pop('assigned_groups', [])
        
        # Create the quiz instance
        quiz = Quiz.objects.create(**validated_data)

        # Manually set assigned students and groups (no auto-adding group members)
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

        # Manually update assigned students and groups (no auto-adding group members)
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
