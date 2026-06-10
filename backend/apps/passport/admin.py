from django.contrib import admin
from .models import (
    ExpertProfile,
    Publication,
    Credential,
    Document,
    WorkExperience,
    Education,
    Certificate,
    Award,
    Patent,
    Paper,
    Project,
    ResearchResult,
    ScienceActivity,
    ProfessionalAssociation,
)


class RelatedInlineMixin(admin.TabularInline):
    extra = 0


class WorkExperienceInline(RelatedInlineMixin):
    model = WorkExperience


class EducationInline(RelatedInlineMixin):
    model = Education


class CertificateInline(RelatedInlineMixin):
    model = Certificate


class AwardInline(RelatedInlineMixin):
    model = Award


class PatentInline(RelatedInlineMixin):
    model = Patent


class PaperInline(RelatedInlineMixin):
    model = Paper


class ProjectInline(RelatedInlineMixin):
    model = Project


class ResearchResultInline(RelatedInlineMixin):
    model = ResearchResult


class ScienceActivityInline(RelatedInlineMixin):
    model = ScienceActivity


class ProfessionalAssociationInline(RelatedInlineMixin):
    model = ProfessionalAssociation


@admin.register(ExpertProfile)
class ExpertProfileAdmin(admin.ModelAdmin):
    list_display = [
        'full_name', 'sti_id', 'organization', 'degree', 'vneid_verified',
        'profile_completeness', 'is_public', 'created_at'
    ]
    list_filter = ['degree', 'vneid_verified', 'is_public', 'created_at']
    search_fields = ['full_name', 'organization', 'orcid', 'sti_id', 'email', 'phone']
    readonly_fields = ['profile_completeness', 'did_uri']
    inlines = [
        WorkExperienceInline,
        EducationInline,
        CertificateInline,
        AwardInline,
        PatentInline,
        PaperInline,
        ProjectInline,
        ResearchResultInline,
        ScienceActivityInline,
        ProfessionalAssociationInline,
    ]


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ['title', 'expert', 'journal', 'year', 'verified']
    list_filter = ['verified', 'source', 'year']
    search_fields = ['title', 'journal', 'doi']


@admin.register(Credential)
class CredentialAdmin(admin.ModelAdmin):
    list_display = ['expert', 'credential_type', 'subject_field', 'status', 'issued_at']
    list_filter = ['credential_type', 'status']
    search_fields = ['expert__full_name']


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['expert', 'original_filename', 'file_type', 'processing_status', 'created_at']
    list_filter = ['file_type', 'processing_status']
    search_fields = ['original_filename']
