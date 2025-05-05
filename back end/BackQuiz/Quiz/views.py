from rest_framework import generics, permissions, status
from .models import Quiz, Question, Option, StudentAnswer, Result, Group, QuizAttempt
from django.db import models
from django.utils import timezone
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import QuizSerializer, QuestionSerializer, OptionSerializer, StudentAnswerSerializer, ResultSerializer, GroupSerializer, QuizResultDetailSerializer, StudentQuizHistorySerializer
from .permissions import IsTeacher, IsStudent, IsTeacherOrReadOnly
from rest_framework.views import APIView
from rest_framework import serializers

# ✅ Quiz Views
class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrReadOnly]  # Students can view, teachers can create/edit

    def perform_create(self, serializer):
        # Save the quiz with the teacher as the creator
        quiz = serializer.save(teacher=self.request.user)

        # Explicitly set assigned students and groups (no auto-adding group members)
        assigned_students = serializer.validated_data.get('assigned_students', [])
        assigned_groups = serializer.validated_data.get('assigned_groups', [])

        quiz.assigned_students.set(assigned_students)
        quiz.assigned_groups.set(assigned_groups)

class AssignedQuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        student = self.request.user
        
        # Get all quizzes assigned to the student
        assigned_quizzes = Quiz.objects.filter(
            models.Q(assigned_students=student) | 
            models.Q(assigned_groups__students=student)
        ).distinct()
        
        # Filter out quizzes where the student has used all attempts
        available_quizzes = []
        for quiz in assigned_quizzes:
            attempts_count = QuizAttempt.objects.filter(
                quiz=quiz,
                student=student,
                is_completed=True
            ).count()
            
            if attempts_count < quiz.max_attempts and quiz.is_active:
                available_quizzes.append(quiz.id)
                
        return Quiz.objects.filter(id__in=available_quizzes)

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrReadOnly]
    
    def perform_update(self, serializer):
        # Save the quiz with core fields
        quiz = serializer.save()
        
        # Handle assigned students and groups manually to prevent auto-selection
        if 'assigned_students' in serializer.validated_data:
            assigned_students = serializer.validated_data.get('assigned_students', [])
            quiz.assigned_students.set(assigned_students)
            
        if 'assigned_groups' in serializer.validated_data:
            assigned_groups = serializer.validated_data.get('assigned_groups', [])
            quiz.assigned_groups.set(assigned_groups)

# Student-specific views for accessing quiz structure
class StudentQuizQuestionsView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id')
        user = self.request.user
        
        try:
            quiz = Quiz.objects.get(pk=quiz_id)
            
            # Always allow teachers to access
            if hasattr(user, 'is_teacher') and user.is_teacher:
                return Question.objects.filter(quiz_id=quiz_id)
                
            # For students, check attempts and quiz access
            if self.can_student_access_quiz(user, quiz):
                return Question.objects.filter(quiz_id=quiz_id)
            
            return Question.objects.none()
            
        except Quiz.DoesNotExist:
            return Question.objects.none()

    def can_student_access_quiz(self, student, quiz):
        """Check if a student can still access this quiz based on attempts and assignment"""
        # Check if quiz is active
        if not quiz.is_active:
            return False
            
        # Check if student is assigned to this quiz (directly or via group)
        is_assigned = (student in quiz.assigned_students.all() or 
                      quiz.assigned_groups.filter(students=student).exists())
        if not is_assigned:
            return False
            
        # Check number of attempts
        attempts_count = QuizAttempt.objects.filter(
            quiz=quiz,
            student=student,
            is_completed=True
        ).count()
        
        # Student can access if they haven't reached the maximum attempts
        return attempts_count < quiz.max_attempts

# Also update StudentQuestionOptionsView similarly
class StudentQuestionOptionsView(generics.ListAPIView):
    serializer_class = OptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        question_id = self.kwargs.get('question_id')
        try:
            # Get the question and its related quiz
            question = Question.objects.get(pk=question_id)
            quiz = question.quiz
            user = self.request.user
            
            # Check if user has teacher permissions
            if hasattr(user, 'is_teacher') and user.is_teacher:
                return Option.objects.filter(question_id=question_id)
            
            # Check if user is directly assigned to the quiz
            if user in quiz.assigned_students.all():
                return Option.objects.filter(question_id=question_id)
                
            # Check if user belongs to any group assigned to the quiz
            # Check using the related_name from the model
            for group in quiz.assigned_groups.all():
                if group.students.filter(id=user.id).exists():  # Use the correct field name
                    return Option.objects.filter(question_id=question_id)
                    
            return Option.objects.none()
            
        except Question.DoesNotExist:
            return Option.objects.none()


class QuizSubmitView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    
    def post(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(pk=quiz_id)
            student = request.user
            
            # Check if student can submit this quiz
            attempts_count = QuizAttempt.objects.filter(
                quiz=quiz,
                student=student,
                is_completed=True
            ).count()
            
            if attempts_count >= quiz.max_attempts:
                return Response(
                    {"error": "You have used all your allowed attempts for this quiz."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get or create the current attempt
            current_attempt, created = QuizAttempt.objects.get_or_create(
                quiz=quiz,
                student=student,
                is_completed=False,
                defaults={'attempt_number': attempts_count + 1}
            )
            
            # Mark current attempt as completed
            current_attempt.is_completed = True
            current_attempt.completed_at = timezone.now()
            current_attempt.save()
            
            # Calculate score for this attempt
            result, created = Result.objects.get_or_create(
                quiz=quiz,
                student=student,
                defaults={'score': 0, 'max_score': quiz.questions.aggregate(total_points=models.Sum('points'))['total_points']}
            )
            result.calculate_score()
            
            return Response({
                "message": "Quiz submitted successfully.",
                "attempt_number": current_attempt.attempt_number,
                "attempts_remaining": max(0, quiz.max_attempts - attempts_count - 1),
                "score": result.score,
                "max_score": result.max_score,
                "percentage": round((result.score / result.max_score * 100) if result.max_score > 0 else 0, 2)
            })
            
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

class QuestionCreateView(generics.CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

# Option views
class OptionListCreateView(generics.ListCreateAPIView):
    serializer_class = OptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]  # Teacher only

    def get_queryset(self):
        question_id = self.kwargs.get('question_id')
        return Option.objects.filter(question_id=question_id)

class OptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

class StudentAnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentAnswerSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        return StudentAnswer.objects.filter(student=self.request.user)

    def create(self, request, *args, **kwargs):
        # Get question and check if its quiz is still active
        question_id = request.data.get('question')
        try:
            question = Question.objects.get(pk=question_id)
            quiz = question.quiz
            student = request.user
            
            # Check if quiz is active for submission
            if not quiz.is_active:
                return Response(
                    {"error": "This quiz is no longer active. You cannot submit answers."},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            # Check if student has attempts remaining
            attempts_count = QuizAttempt.objects.filter(
                quiz=quiz,
                student=student,
                is_completed=True
            ).count()
            
            if attempts_count >= quiz.max_attempts:
                return Response(
                    {"error": "You have used all your allowed attempts for this quiz."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get or create the current attempt
            current_attempt, created = QuizAttempt.objects.get_or_create(
                quiz=quiz,
                student=student,
                is_completed=False,
                defaults={'attempt_number': attempts_count + 1}
            )
                
            # Continue with normal creation process
            return super().create(request, *args, **kwargs)
            
        except Question.DoesNotExist:
            return Response(
                {"error": "Question not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        

class StudentAnswerDetailView(generics.RetrieveAPIView):
    queryset = StudentAnswer.objects.all()
    serializer_class = StudentAnswerSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        return StudentAnswer.objects.filter(student=self.request.user)  # Students only see their own answers

# ✅ Result Views (Students can only see their own results)
class ResultListView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Result.objects.filter(student=self.request.user)  # Students only see 

    
class StudentQuizResultDetailView(generics.RetrieveAPIView):
    serializer_class = QuizResultDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Check if the user has permission to view this result
        if not request.user.is_teacher and instance.student != request.user:
            return Response({"error": "You do not have permission to view this result."},
                            status=status.HTTP_403_FORBIDDEN)

        # Check if the quiz time has ended or max attempts are reached
        quiz = instance.quiz
        current_time = timezone.now()
        attempts_used = QuizAttempt.objects.filter(
            quiz=quiz,
            student=instance.student,
            is_completed=True
        ).count()

        if current_time < quiz.end_time and attempts_used < quiz.max_attempts:
            return Response(
                {"message": "The solution is not available yet. You can still attempt the quiz."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all questions in the quiz
        questions = Question.objects.filter(quiz=quiz)

        # Get all answers submitted by the student for this quiz
        answers = StudentAnswer.objects.filter(
            student=instance.student,
            question__quiz=quiz
        )

        # Format detailed question results
        question_results = []
        for question in questions:
            try:
                answer = answers.get(question=question)
                answer_data = {
                    'question_id': question.id,
                    'question_text': question.text,
                    'question_type': question.question_type,
                    'points_possible': question.points,
                    'points_earned': answer.earned_points,
                }
                # Add selected option details
                if answer.selected_option:
                    answer_data.update({
                        'selected_option_id': answer.selected_option.id,
                        'selected_option_text': answer.selected_option.text,
                        'is_correct': answer.selected_option.is_correct
                    })
                # Add text answer if applicable
                elif answer.text_answer:
                    answer_data.update({
                        'text_answer': answer.text_answer,
                        'is_graded': answer.earned_points > 0
                    })

                question_results.append(answer_data)

            except StudentAnswer.DoesNotExist:
                # Question wasn't answered
                question_results.append({
                    'question_id': question.id,
                    'question_text': question.text,
                    'question_type': question.question_type,
                    'points_possible': question.points,
                    'points_earned': 0,
                    'status': 'Not answered'
                })

        # Get the serialized result data
        serializer = self.get_serializer(instance)
        data = serializer.data

        # Add the detailed question results
        data['question_results'] = question_results
        data['quiz_title'] = quiz.title

        return Response(data)

# ✅ Group Views (for Teachers)
class GroupListCreateView(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Group.objects.filter(teacher=self.request.user)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Group.objects.filter(teacher=self.request.user)
    


class StudentQuizHistoryView(generics.ListAPIView):
    """
    View for students to see their history of completed quizzes with results.
    This endpoint returns all quizzes the student has submitted answers for, 
    along with their scores and completion date.
    """
    serializer_class = StudentQuizHistorySerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    
    def get_queryset(self):
        student = self.request.user
        
        # Get all quizzes where the student has submitted at least one answer
        answered_quiz_ids = StudentAnswer.objects.filter(
            student=student
        ).values_list('question__quiz', flat=True).distinct()
        
        # Get results for these quizzes
        return Result.objects.filter(
            student=student,
            quiz_id__in=answered_quiz_ids
        ).select_related('quiz').order_by('-completed_at')

class AbsentStudentsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(pk=quiz_id)
            absent_students = Result.objects.filter(quiz=quiz, is_absent=True).select_related('student')

            data = [
                {
                    "id": result.student.id,
                    "username": result.student.username,
                    "email": result.student.email,
                }
                for result in absent_students
            ]

            return Response({"absent_students": data}, status=200)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found."}, status=404)

class QuizQuestionsCreateView(generics.CreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def create(self, request, *args, **kwargs):
        quiz_id = self.kwargs.get('quiz_id')

        # Ensure the quiz exists
        try:
            quiz = Quiz.objects.get(pk=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        # Add the quiz ID to each question in the payload
        questions_data = request.data.get('questions', [])
        if not questions_data:
            return Response({"error": "No questions provided."}, status=status.HTTP_400_BAD_REQUEST)

        created_questions = []
        for question_data in questions_data:
            question_data['quiz'] = quiz.id  # Associate the question with the quiz
            serializer = self.get_serializer(data=question_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            created_questions.append(serializer.data)

        return Response({"quiz": quiz_id, "questions": created_questions}, status=status.HTTP_201_CREATED)


