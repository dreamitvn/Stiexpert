"""Custom permissions for STI-Expert."""
from rest_framework.permissions import BasePermission


class IsExpert(BasePermission):
    """Allow access only to users with the 'expert' role."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "expert"
        )


class IsBusiness(BasePermission):
    """Allow access only to users with the 'business' role."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "business"
        )


class IsOrganization(BasePermission):
    """Allow access only to users with the 'organization' role."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "organization"
        )


class IsAdmin(BasePermission):
    """Allow access only to admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.role == "admin" or request.user.is_staff)
        )


class IsManagerOrAdmin(BasePermission):
    """Allow manager/super-admin users to approve professional trust badges."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.role in {"manager", "admin"} or request.user.is_staff)
        )


class IsVerificationStaffOrAdmin(BasePermission):
    """Allow verification staff/super-admin users to approve identity badges."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.role in {"verification_staff", "admin"} or request.user.is_staff)
        )
