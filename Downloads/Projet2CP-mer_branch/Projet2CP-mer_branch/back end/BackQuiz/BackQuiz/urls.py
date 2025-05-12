from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/Quiz/', include('Quiz.urls')),
    path('api/', include('notifications.urls')), 

    path('api-auth/', include('rest_framework.urls'))
     
     
]

