"""Admin configuration for authentication app."""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "username", "role", "is_verified", "is_active", "created_at"]
    list_filter = ["role", "is_verified", "is_active", "is_staff"]
    search_fields = ["email", "username", "phone"]
    ordering = ["-created_at"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("STI-Expert Fields", {"fields": ("role", "phone", "is_verified", "did_uri")}),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "language_preference", "created_at"]
    list_filter = ["language_preference"]
    search_fields = ["user__email"]
