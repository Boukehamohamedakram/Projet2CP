from rest_framework import permissions

class IsTeacher(permissions.BasePermission):
    """
    Allows access only to teachers.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'

class IsStudent(permissions.BasePermission):
    """
    Allows access only to students.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsTeacherOrReadOnly(permissions.BasePermission):
    """
    Teachers can edit, but students & unauthenticated users can only view.
    """
    def has_permission(self, request, view):
        # Allow read-only access for safe methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Otherwise, only allow teachers
        return request.user.is_authenticated and request.user.role == 'teacher'
