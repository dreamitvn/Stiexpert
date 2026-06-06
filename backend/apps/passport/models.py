"""Passport models for STI-Expert — Expert profiles, publications, credentials, documents, and full legacy schema from Strapi."""
import uuid

from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class ExpertProfile(models.Model):
    """
    Expert profile — migrated and expanded from old Strapi expert-profile schema.
    Includes all repeatable components as related models.
    """

    class Availability(models.TextChoices):
        AVAILABLE = "available", "Available"
        LIMITED = "limited", "Limited"
        UNAVAILABLE = "unavailable", "Unavailable"

    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        OTHER = "other", "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="expert_profile",
    )

    # Core identity (from old schema)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=50, blank=True, default="")
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True)
    address = models.CharField(max_length=255, blank=True, default="")
    identification_number = models.CharField(max_length=50, blank=True, default="")

    # Professional
    orcid = models.CharField(max_length=50, blank=True, default="")
    organization = models.CharField(max_length=255, blank=True, default="")
    title = models.CharField(max_length=255, blank=True, default="")
    degree = models.CharField(max_length=100, blank=True, default="")
    main_field = models.CharField(max_length=255, blank=True, default="")
    fields = models.JSONField(default=list, blank=True, help_text="List of expertise fields (nganh/specialization)")
    nationality = models.CharField(max_length=100, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    summary = models.TextField(blank=True, default="")

    # Avatar & verification (media)
    avatar = models.ImageField(upload_to="expert_avatars/", blank=True, null=True)
    id_card_front = models.ImageField(upload_to="id_cards/", blank=True, null=True)
    id_card_back = models.ImageField(upload_to="id_cards/", blank=True, null=True)
    id_card_verify_waiting = models.BooleanField(default=False)

    # Social & academic links (increased length for legacy data)
    google_scholar = models.CharField(max_length=500, blank=True, default="")
    facebook = models.CharField(max_length=500, blank=True, default="")
    linkedin = models.CharField(max_length=500, blank=True, default="")
    website = models.CharField(max_length=500, blank=True, default="")

    # Business / availability
    hourly_rate = models.CharField(max_length=50, blank=True, default="")
    availability = models.CharField(
        max_length=20, choices=Availability.choices, default=Availability.AVAILABLE
    )

    # Flags
    featured = models.BooleanField(default=False)
    hide_info = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    profile_completeness = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentage of profile completion",
    )

    did_uri = models.CharField(max_length=255, blank=True, default="")
    privacy_settings = models.JSONField(default=dict, blank=True)

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
            self.full_name, self.email, self.organization, self.title,
            self.degree, self.bio, self.avatar, self.google_scholar,
            self.linkedin,
        ]
        filled = sum(1 for f in scored_fields if f)
        return int((filled / len(scored_fields)) * 100)


# Repeatable components from old Strapi schema (user.* and expert-profile)

class WorkExperience(models.Model):
    """Kinh nghiệm làm việc"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="experiences")
    position = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255, blank=True)
    start_date = models.DateField(null=True, blank=True)
    stop_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "work_experiences"
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.position} at {self.company_name}"


class Education(models.Model):
    """Bằng cấp / Giáo dục"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="education")
    school_name = models.CharField(max_length=255)
    degree = models.CharField(max_length=255, blank=True)
    field_of_study = models.CharField(max_length=255, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "educations"
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.degree} from {self.school_name}"


class Certificate(models.Model):
    """Chứng chỉ"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="certificates")
    name = models.CharField(max_length=255)
    issuing_organization = models.CharField(max_length=255, blank=True)
    issue_date = models.DateField(null=True, blank=True)
    expiration_date = models.DateField(null=True, blank=True)
    credential_url = models.URLField(blank=True)
    license_number = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = "certificates"
        ordering = ["-issue_date"]

    def __str__(self):
        return self.name


class Award(models.Model):
    """Giải thưởng"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="awards")
    name = models.CharField(max_length=255)
    org = models.CharField(max_length=255, blank=True)
    earn_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "awards"
        ordering = ["-earn_date"]

    def __str__(self):
        return self.name


class Patent(models.Model):
    """Sáng chế / Patent"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="patents")
    num = models.CharField(max_length=100, blank=True)
    org = models.CharField(max_length=255, blank=True)
    earn_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "patents"
        ordering = ["-earn_date"]

    def __str__(self):
        return f"Patent {self.num}"


class Paper(models.Model):
    """Bài báo học thuật (from old 'papers' component)"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="papers")
    title = models.CharField(max_length=500)
    year = models.CharField(max_length=10, blank=True)
    link = models.URLField(blank=True)
    cited_by = models.CharField(max_length=50, blank=True)
    authors = models.CharField(max_length=500, blank=True)
    source = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "papers"
        ordering = ["-year"]

    def __str__(self):
        return f"{self.title} ({self.year})"


class Publication(models.Model):
    """Academic publication (legacy + expanded). Kept for backward compat with VC."""
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
    source = models.CharField(max_length=50, blank=True, default="manual")
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


class Project(models.Model):
    """Dự án"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="projects")
    role = models.CharField(max_length=255, blank=True)
    sponsor = models.CharField(max_length=255, blank=True)
    result = models.TextField(blank=True)

    class Meta:
        db_table = "projects"
        ordering = ["-id"]

    def __str__(self):
        return f"Project: {self.role}"


class ResearchResult(models.Model):
    """Kết quả nghiên cứu"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="research_results")
    title = models.CharField(max_length=255)
    result = models.TextField(blank=True)

    class Meta:
        db_table = "research_results"

    def __str__(self):
        return self.title


class ScienceActivity(models.Model):
    """Hoạt động khoa học"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="science_activities")
    description = models.TextField()

    class Meta:
        db_table = "science_activities"

    def __str__(self):
        return self.description[:50]


class ProfessionalAssociation(models.Model):
    """Hiệp hội chuyên môn"""
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name="associations")
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "professional_associations"

    def __str__(self):
        return self.name


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
