from djoser.views import UserViewSet
from rest_framework.permissions import BasePermission


class TaxomapUsersViewSet(UserViewSet):
    def get_permissions(self):
        if self.action == "me" and self.request and self.request.method == "DELETE":
            return [DenyAll()]
        return super().get_permissions()


class DenyAll(BasePermission):
    def has_permission(self, request, view):
        return False

    def has_object_permission(self, request, view, obj):
        return False
