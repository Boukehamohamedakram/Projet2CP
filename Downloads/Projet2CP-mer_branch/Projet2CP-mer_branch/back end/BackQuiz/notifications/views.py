from rest_framework import generics, permissions
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListCreateView(generics.ListCreateAPIView):
    """Handles listing all notifications and creating a new notification."""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

class NotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Handles retrieving, updating, and deleting a notification."""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
