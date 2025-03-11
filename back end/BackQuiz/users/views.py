from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .permissions import IsTeacher

# ✅ Teacher can manage users (CRUD)
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

# ✅ User Registration
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from django.contrib.auth import authenticate
from .serializers import LoginSerializer
from .models import User

class LoginView(generics.GenericAPIView):  # ✅ Use GenericAPIView
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )

        if user:
            token, created = Token.objects.get_or_create(user=user)  
            return Response({
                'token': token.key,
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role, 
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
