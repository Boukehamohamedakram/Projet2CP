from django.urls import path
from .views import (
    QuizListCreateView, QuizDetailView, AssignedQuizListView,
    QuestionListCreateView, QuestionDetailView,
    OptionListCreateView, OptionDetailView,
    StudentAnswerListCreateView, StudentAnswerDetailView,
    ResultListView ,
    GroupListCreateView, GroupDetailView
)

urlpatterns = [
    # Quiz URLs
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-list-create'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/assigned/', AssignedQuizListView.as_view(), name='assigned-quizzes'),

    path('groups/', GroupListCreateView.as_view(), name='group-list-create'),
    path('groups/<int:pk>/', GroupDetailView.as_view(), name='group-detail'),


    # Question URLs
    path('questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),

    # Option URLs
    path('options/', OptionListCreateView.as_view(), name='option-list-create'),
    path('options/<int:pk>/', OptionDetailView.as_view(), name='option-detail'),

    # Student Answer URLs
    path('answers/', StudentAnswerListCreateView.as_view(), name='answer-list-create'),
    path('answers/<int:pk>/', StudentAnswerDetailView.as_view(), name='answer-detail'),

    # Results URLs
    path('results/', ResultListView.as_view(), name='result-list'),
]