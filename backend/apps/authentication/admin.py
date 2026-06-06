"""Admin configuration for authentication app."""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

from .models import User, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        "email", "username", "role_badge", "verified_badge", "is_active", "created_at"
    ]
    list_filter = ["role", "is_verified", "is_active", "is_staff", "created_at"]
    search_fields = ["email", "username", "phone"]
    ordering = ["-created_at"]
    list_per_page = 25
    actions = ["verify_users", "deactivate_users", "activate_users"]

    fieldsets = BaseUserAdmin.fieldsets + (
        ("STI-Expert Fields", {"fields": ("role", "phone", "is_verified", "did_uri")}),
    )

    def role_badge(self, obj):
        colors = {"expert": "#10b981", "business": "#3b82f6", "organization": "#8b5cf6", "admin": "#ef4444"}
        color = colors.get(obj.role, "#6b7280")
        return format_html(
            '<span style="background:{c};color:#fff;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:500">{role}</span>',
            c=color, role=obj.get_role_display()
        )
    role_badge.short_description = "Vai trò"

    def verified_badge(self, obj):
        if obj.is_verified:
            return format_html('<span style="color:#10b981">✓ Đã xác thực</span>')
        return format_html('<span style="color:#ef4444">✗ Chưa xác thực</span>')
    verified_badge.short_description = "Xác thực"

    @admin.action(description="Xác thực người dùng đã chọn")
    def verify_users(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(request, f"{queryset.count()} người dùng đã được xác thực.")

    @admin.action(description="Vô hiệu hóa người dùng đã chọn")
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} người dùng đã bị vô hiệu hóa.")

    @admin.action(description="Kích hoạt người dùng đã chọn")
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} người dùng đã được kích hoạt.")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user_email", "language_preference", "created_at"]
    list_filter = ["language_preference"]
    search_fields = ["user__email"]
    list_per_page = 25

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User"