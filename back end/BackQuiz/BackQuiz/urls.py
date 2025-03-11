from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin panel

    # API endpoints for each app
    path('api/users/', include('users.urls')),  
    path('api/quizzes/', include('Quiz.urls')),
    path('api/notifications/', include('notifications.urls')),

    # JWT Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token
]
