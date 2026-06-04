"""Passport models for STI-Expert — Expert profiles, publications, credentials, documents."""
import uuid

from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class ExpertProfile(models.Model):
    """
    Expert profile — the core of the STI Passport.
    Contains professional info, research fields, and verification status.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="expert_profile",
    )
    full_name = models.CharField(max_length=255)
    orcid = models.CharField(max_length=50, blank=True, default="")
    organization = models.CharField(max_length=255, blank=True, default="")
    title = models.CharField(max_length=255, blank=True, default="")
    degree = models.CharField(max_length=100, blank=True, default="")
    fields = models.JSONField(default=list, blank=True, help_text="List of expertise fields")
    nationality = models.CharField(max_length=100, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    avatar = models.ImageField(upload_to="expert_avatars/", blank=True, null=True)
    did_uri = models.CharField(max_length=255, blank=True, default="")
    profile_completeness = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentage of profile completion",
    )
    is_public = models.BooleanField(default=True)
    privacy_settings = models.JSONField(
        default=dict,
        blank=True,
        help_text="Granular privacy settings for profile fields",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "expert_profiles"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.organization})"

    def calculate_completeness(self) -> int:
        """Calculate profile completeness percentage."""
        scored_fields = [
            self.full_name, self.orcid, self.organization, self.title,
            self.degree, self.fields, self.nationality, self.bio, self.avatar,
        ]
        filled = sum(1 for f in scored_fields if f)
        return int((filled / len(scored_fields)) * 100)


class Publication(models.Model):
    """Academic publication linked to an expert profile."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    expert = models.ForeignKey(
        ExpertProfile,
        on_delete=models.CASCADE,
        related_name="publications",
    )
    title = models.CharField(max_length=500)
    abstract = models.TextField(blank=True, default="")
    keywords = models.JSONField(default=list, blank=True)
    journal = models.CharField(max_length=255, blank=True, default="")
    year = models.IntegerField(null=True, blank=True)
    doi = models.CharField(max_length=255, blank=True, default="")
    co_authors = models.JSONField(default=list, blank=True)
    source = models.CharField(
        max_length=50,
        blank=True,
        default="manual",
        help_text="Source: orcid, crossref, manual, pdf",
    )
    verified = models.BooleanField(default=False)
    vc = models.ForeignKey(
        "Credential",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="publications",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "publications"
        ordering = ["-year", "-created_at"]

    def __str__(self):
        return f"{self.title} ({self.year})"


class Credential(models.Model):
    """Verifiable Credential (VC) for expert qualifications."""

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        REVOKED = "revoked", "Revoked"
        EXPIRED = "expired", "Expired"
        PENDING = "pending", "Pending"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    expert = models.ForeignKey(
        ExpertProfile,
        on_delete=models.CASCADE,
        related_name="credentials",
    )
    credential_type = models.CharField(max_length=100, help_text="e.g. degree, certification, award")
    subject_field = models.CharField(max_length=255, blank=True, default="")
    vc_jwt = models.TextField(blank=True, default="", help_text="JWT-encoded Verifiable Credential")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    issued_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    issuer_did = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "credentials"
        ordering = ["-issued_at"]

    def __str__(self):
        return f"{self.credential_type}: {self.subject_field} ({self.status})"


class Document(models.Model):
    """Uploaded document (CV, publication PDF, certificate) for processing."""

    class FileType(models.TextChoices):
        PDF = "pdf", "PDF"
        IMAGE = "image", "Image"
        OTHER = "other", "Other"

    class ProcessingStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    expert = models.ForeignKey(
        ExpertProfile,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    file = models.FileField(upload_to="documents/%Y/%m/")
    original_filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=20, choices=FileType.choices, default=FileType.PDF)
    file_size = models.BigIntegerField(default=0, help_text="File size in bytes")
    processing_status = models.CharField(
        max_length=20,
        choices=ProcessingStatus.choices,
        default=ProcessingStatus.PENDING,
    )
    extracted_data = models.JSONField(default=dict, blank=True, help_text="Data extracted from document")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "documents"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.original_filename} ({self.processing_status})"
