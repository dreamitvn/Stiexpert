"""Authentication models for STI-Expert."""
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with role-based access for the STI platform."""

    class Role(models.TextChoices):
        EXPERT = "expert", "Expert"
        BUSINESS = "business", "Business"
        ORGANIZATION = "organization", "Organization"
        ADMIN = "admin", "Admin"
        MANAGER = "manager", "Manager"
        VERIFICATION_STAFF = "verification_staff", "Verification Staff"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.EXPERT)
    phone = models.CharField(max_length=20, blank=True, default="")
    is_verified = models.BooleanField(default=False)
    did_uri = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} ({self.role})"


class UserProfile(models.Model):
    """Extended profile info linked to User."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    language_preference = models.CharField(max_length=10, default="vi")
    notification_settings = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_profiles"

    def __str__(self):
        return f"Profile of {self.user.email}"


class PasswordResetToken(models.Model):
    """One-time token for password reset. Expires after 30 minutes."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reset_tokens")
    token = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    class Meta:
        db_table = "password_reset_tokens"
        ordering = ["-created_at"]

    @property
    def is_expired(self):
        from django.utils import timezone
        from datetime import timedelta

        return timezone.now() > self.created_at + timedelta(minutes=30)

    @property
    def is_valid(self):
        return not self.used and not self.is_expired

    def __str__(self):
        return f"ResetToken({self.user.email}, used={self.used})"
