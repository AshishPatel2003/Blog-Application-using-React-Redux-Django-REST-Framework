from rest_framework.permissions import BasePermission

from User.models import User

class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.id == view.kwargs.get('id')
    
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_admin