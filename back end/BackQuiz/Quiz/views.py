from rest_framework import generics, permissions
from .models import Quiz, Question, Option, StudentAnswer, Result
from .serializers import QuizSerializer, QuestionSerializer, OptionSerializer, StudentAnswerSerializer, ResultSerializer
from .permissions import IsTeacher, IsStudent, IsTeacherOrReadOnly

# ✅ Quiz Views
class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrReadOnly]  # Students can view, teachers can create/edit

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrReadOnly]

# ✅ Question Views (Belongs to a quiz)
class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Question.objects.filter(quiz_id=self.kwargs['quiz_id'])  # Filter by quiz

class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

# ✅ Option Views (Belongs to a question)
class OptionListCreateView(generics.ListCreateAPIView):
    serializer_class = OptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Option.objects.filter(question_id=self.kwargs['question_id'])  # Filter by question

class OptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

# ✅ Student Answer Views (Students can only submit & view their own answers)
class StudentAnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentAnswerSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        return StudentAnswer.objects.filter(student=self.request.user)  # Students only see their own answers

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
        return Result.objects.filter(student=self.request.user)  # Students only see their own results
