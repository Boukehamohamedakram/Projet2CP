from django.urls import path
from .views import UserListCreateView, UserDetailView, RegisterView, LoginView, StudentListView, BulkStudentUploadView

urlpatterns = [
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/students/', StudentListView.as_view(), name='student-list'),
    path('users/bulk-upload/', BulkStudentUploadView.as_view(), name='bulk-student-upload'),
]
