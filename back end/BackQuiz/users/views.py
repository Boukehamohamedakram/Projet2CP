from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, BulkStudentUploadSerializer
from .permissions import IsTeacher

from rest_framework.permissions import AllowAny

import csv
from io import StringIO
from rest_framework.views import APIView

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
    # yakoub add
    permission_classes = [AllowAny] 

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from django.contrib.auth import authenticate
from .serializers import LoginSerializer
from .models import User

class LoginView(generics.GenericAPIView):  # ✅ Use GenericAPIView
    serializer_class = LoginSerializer
  # ✅ Allow any user to access this view

    permission_classes = [AllowAny]  


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

class BulkStudentUploadView(generics.CreateAPIView):
    serializer_class = BulkStudentUploadSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def create(self, request, *args, **kwargs):
        # Validate the uploaded file
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get the uploaded file
        file = serializer.validated_data['file']

        # Read and parse the CSV file
        try:
            decoded_file = file.read().decode('utf-8')
            csv_data = csv.DictReader(StringIO(decoded_file))
        except Exception as e:
            return Response({"error": f"Invalid CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Process each row in the CSV
        created_users = []
        errors = []
        for row in csv_data:
            username = row.get('username')
            password = row.get('password')
            email = row.get('email')

            # Validate required fields
            if not username or not password or not email:
                errors.append({"row": row, "error": "Missing required fields (username, password, email)."})
                continue

            # Check for duplicate usernames or emails
            if User.objects.filter(username=username).exists():
                errors.append({"row": row, "error": f"Username '{username}' already exists."})
                continue
            if User.objects.filter(email=email).exists():
                errors.append({"row": row, "error": f"Email '{email}' already exists."})
                continue

            # Create the user
            try:
                user = User.objects.create_user(username=username, password=password, email=email, role='student')
                created_users.append(UserSerializer(user).data)
            except Exception as e:
                errors.append({"row": row, "error": str(e)})

        # Return the response
        return Response({
            "created_users": created_users,
            "errors": errors
        }, status=status.HTTP_201_CREATED if created_users else status.HTTP_400_BAD_REQUEST)

class StudentListView(generics.ListAPIView):
    queryset = User.objects.filter(role='student')  # List all students
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]
