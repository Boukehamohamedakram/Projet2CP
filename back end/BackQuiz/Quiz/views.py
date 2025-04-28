from rest_framework import generics, permissions, status
from .models import Quiz, Question, Option, StudentAnswer, Result, Group
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import QuizSerializer, QuestionSerializer, OptionSerializer, StudentAnswerSerializer, ResultSerializer, GroupSerializer, QuizResultDetailSerializer, StudentQuizHistorySerializer
from .permissions import IsTeacher, IsStudent, IsTeacherOrReadOnly

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
        return Quiz.objects.filter(assigned_students=self.request.user)

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
            
            # Check if quiz is active (time-based)
            if not quiz.is_active and not (hasattr(user, 'is_teacher') and user.is_teacher):
                return Question.objects.none()  # Quiz is not active, return no questions for students
            
            # Check if user can access this quiz
            if hasattr(user, 'is_teacher') and user.is_teacher:
                return Question.objects.filter(quiz_id=quiz_id)
            elif user in quiz.assigned_students.all() or quiz.assigned_groups.filter(members=user).exists():
                return Question.objects.filter(quiz_id=quiz_id)
            return Question.objects.none()
            
        except Quiz.DoesNotExist:
            return Question.objects.none()

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

class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]  # Teacher only

    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id', None)
        if quiz_id:
            return Question.objects.filter(quiz_id=quiz_id)
        return Question.objects.all()

    def create(self, request, *args, **kwargs):
        # Make a mutable copy of the request data
        data = request.data.copy()
        
        # Extract options data from the copy
        options_data = data.pop('options', [])
        
        # Create the question first
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        
        # Now create options for this question
        has_correct_option = False
        for option_data in options_data:
            option_data['question'] = question.id
            option_serializer = OptionSerializer(data=option_data)
            if option_serializer.is_valid():
                option = option_serializer.save()
                if option.is_correct:
                    has_correct_option = True
        
        # Validate that at least one option is marked as correct
        if not has_correct_option and options_data:
            question.delete()  # Delete the question if no correct option
            return Response(
                {"error": "At least one option must be marked as correct."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

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
            
            # Check if quiz is active for submission
            if not quiz.is_active:
                return Response(
                    {"error": "This quiz is no longer active. You cannot submit answers."},
                    status=status.HTTP_403_FORBIDDEN
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

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'is_teacher') and user.is_teacher:
            return Result.objects.all()
        return Result.objects.filter(student=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Check if the user has permission to view this result
        if not request.user.is_teacher and instance.student != request.user:
            return Response({"error": "You do not have permission to view this result."},
                            status=status.HTTP_403_FORBIDDEN)

        # Get all questions in the quiz
        questions = Question.objects.filter(quiz=instance.quiz)

        # Get all answers submitted by the student for this quiz
        answers = StudentAnswer.objects.filter(
            student=instance.student,
            question__quiz=instance.quiz
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
        data['quiz_title'] = instance.quiz.title

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