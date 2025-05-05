from django.urls import path
from .views import (
    QuizListCreateView, QuizDetailView, AssignedQuizListView,
    QuestionCreateView, QuestionDetailView,
    OptionListCreateView, OptionDetailView,
    StudentAnswerListCreateView, StudentAnswerDetailView,
    ResultListView,
    GroupListCreateView, GroupDetailView, StudentQuizHistoryView,
    # Student quiz views
    StudentQuizQuestionsView, StudentQuestionOptionsView,
    StudentQuizResultDetailView,
    QuizSubmitView,
    AbsentStudentsView,
    QuizQuestionsCreateView,
    QuizAnalyticsView,

)

urlpatterns = [
  
        # Quiz URLs
        path('quizzes/', QuizListCreateView.as_view(), name='quiz-list-create'),
        path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
        path('quizzes/assigned/', AssignedQuizListView.as_view(), name='assigned-quizzes'),
        
        # Student-specific quiz structure URLs
        path('quizzes/<int:quiz_id>/questions/', StudentQuizQuestionsView.as_view(), name='student-quiz-questions'),
        path('quizzes/<int:quiz_id>/questions/create/', QuizQuestionsCreateView.as_view(), name='quiz-questions-create'),
        
        # Question URLs
        path('questions/', QuestionCreateView.as_view(), name='question-list-create'),
        path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
        
        # Option URLs
        path('options/', OptionListCreateView.as_view(), name='option-list-create'),
        path('options/<int:pk>/', OptionDetailView.as_view(), name='option-detail'),
        
        # NEW: Student question options view
        path('questions/<int:question_id>/options/', StudentQuestionOptionsView.as_view(), name='student-question-options'),
        
        # NEW: Create options for a specific question
        path('questions/<int:question_id>/options/create/', OptionListCreateView.as_view(), name='create-options-for-question'),
        
        # Group URLs
        path('groups/', GroupListCreateView.as_view(), name='group-list-create'),
        path('groups/<int:pk>/', GroupDetailView.as_view(), name='group-detail'),
        
        # Student Answer URLs
        path('answers/', StudentAnswerListCreateView.as_view(), name='answer-list-create'),
        path('answers/<int:pk>/', StudentAnswerDetailView.as_view(), name='answer-detail'),
        
        # Results URLs
        path('results/', ResultListView.as_view(), name='result-list'),
        # Add this to your urlpatterns
        path('results/<int:pk>/detail/', StudentQuizResultDetailView.as_view(), name='student-quiz-result-detail'),
        # Add this to your urlpatterns
        path('quiz-history/', StudentQuizHistoryView.as_view(), name='student-quiz-history'),
        path('quizzes/<int:quiz_id>/submit/', QuizSubmitView.as_view(), name='quiz-submit'),
        
        # Absent students and analytics URL
        path('quizzes/<int:quiz_id>/absent-students/', AbsentStudentsView.as_view(), name='absent-students'),
        path('quizzes/<int:quiz_id>/analytics/', QuizAnalyticsView.as_view(), name='quiz-analytics'),

    ]