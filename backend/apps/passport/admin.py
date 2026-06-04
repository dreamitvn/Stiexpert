from django.contrib import admin
from .models import ExpertProfile, Publication, Credential, Document


@admin.register(ExpertProfile)
class ExpertProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'organization', 'degree', 'profile_completeness', 'is_public', 'created_at']
    list_filter = ['degree', 'is_public', 'created_at']
    search_fields = ['full_name', 'organization', 'orcid']
    readonly_fields = ['profile_completeness', 'did_uri']


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
