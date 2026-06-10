"""Passport serializers for STI-Expert."""
from rest_framework import serializers

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


class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = ["id", "position", "company_name", "start_date", "stop_date", "description"]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "school_name", "degree", "field_of_study", "start_date", "end_date", "description"]


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ["id", "name", "issuing_organization", "issue_date", "expiration_date", "credential_url", "license_number"]


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ["id", "name", "org", "earn_date"]


class PatentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patent
        fields = ["id", "num", "org", "earn_date"]


class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ["id", "title", "year", "link", "cited_by", "authors", "source"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "role", "sponsor", "result"]


class ResearchResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchResult
        fields = ["id", "title", "result"]


class ScienceActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ScienceActivity
        fields = ["id", "description"]


class ProfessionalAssociationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalAssociation
        fields = ["id", "name"]


class ExpertProfileSerializer(serializers.ModelSerializer):
    """Serializer for ExpertProfile CRUD, including writable nested passport sections."""

    profile_completeness = serializers.IntegerField(read_only=True)
    experiences = WorkExperienceSerializer(many=True, required=False)
    education = EducationSerializer(many=True, required=False)
    certificates = CertificateSerializer(many=True, required=False)
    awards = AwardSerializer(many=True, required=False)
    patents = PatentSerializer(many=True, required=False)
    papers = PaperSerializer(many=True, required=False)
    projects = ProjectSerializer(many=True, required=False)
    research_results = ResearchResultSerializer(many=True, required=False)
    science_activities = ScienceActivitySerializer(many=True, required=False)
    associations = ProfessionalAssociationSerializer(many=True, required=False)

    NESTED = {
        "experiences": (WorkExperience, WorkExperienceSerializer),
        "education": (Education, EducationSerializer),
        "certificates": (Certificate, CertificateSerializer),
        "awards": (Award, AwardSerializer),
        "patents": (Patent, PatentSerializer),
        "papers": (Paper, PaperSerializer),
        "projects": (Project, ProjectSerializer),
        "research_results": (ResearchResult, ResearchResultSerializer),
        "science_activities": (ScienceActivity, ScienceActivitySerializer),
        "associations": (ProfessionalAssociation, ProfessionalAssociationSerializer),
    }

    class Meta:
        model = ExpertProfile
        fields = [
            "id", "user", "sti_id", "full_name", "email", "phone", "dob", "gender",
            "address", "identification_number", "orcid", "organization", "title",
            "degree", "main_field", "fields", "nationality", "bio", "summary",
            "avatar", "did_uri", "vneid_verified", "google_scholar", "researchgate",
            "facebook", "linkedin", "website", "profile_completeness", "hide_info",
            "is_public", "privacy_settings", "experiences", "education", "certificates",
            "awards", "patents", "papers", "projects", "research_results",
            "science_activities", "associations", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "did_uri", "profile_completeness", "created_at", "updated_at"]

    def update(self, instance, validated_data):
        nested_payload = {name: validated_data.pop(name) for name in list(self.NESTED) if name in validated_data}
        instance = super().update(instance, validated_data)
        for name, items in nested_payload.items():
            model, _serializer = self.NESTED[name]
            getattr(instance, name).all().delete()
            clean_items = []
            for item in items:
                item.pop("id", None)
                clean_items.append(model(expert=instance, **item))
            if clean_items:
                model.objects.bulk_create(clean_items)
        instance.refresh_from_db()
        return instance


class PublicExpertProfileSerializer(serializers.ModelSerializer):
    """Serializer for public expert profile view with nested passport sections."""

    publications_count = serializers.IntegerField(source="publications.count", read_only=True)
    credentials_count = serializers.IntegerField(source="credentials.count", read_only=True)
    experiences = WorkExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    certificates = CertificateSerializer(many=True, read_only=True)
    awards = AwardSerializer(many=True, read_only=True)
    patents = PatentSerializer(many=True, read_only=True)
    papers = PaperSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    research_results = ResearchResultSerializer(many=True, read_only=True)
    science_activities = ScienceActivitySerializer(many=True, read_only=True)
    associations = ProfessionalAssociationSerializer(many=True, read_only=True)

    class Meta:
        model = ExpertProfile
        fields = [
            "id", "sti_id", "full_name", "email", "phone", "dob", "gender", "address",
            "organization", "title", "degree", "main_field", "fields", "nationality",
            "bio", "summary", "avatar", "vneid_verified", "did_uri", "orcid",
            "google_scholar", "researchgate", "facebook", "linkedin", "website",
            "publications_count", "credentials_count", "experiences", "education",
            "certificates", "awards", "patents", "papers", "projects", "research_results",
            "science_activities", "associations",
        ]


class PublicationSerializer(serializers.ModelSerializer):
    """Serializer for Publication model."""

    class Meta:
        model = Publication
        fields = [
            "id", "expert", "title", "abstract", "keywords", "journal",
            "year", "doi", "co_authors", "source", "verified", "vc",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "expert", "verified", "vc", "created_at", "updated_at"]


class CredentialSerializer(serializers.ModelSerializer):
    """Serializer for Credential model."""

    class Meta:
        model = Credential
        fields = [
            "id", "expert", "credential_type", "subject_field", "vc_jwt",
            "status", "issued_at", "expires_at", "issuer_did",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "expert", "vc_jwt", "status", "issuer_did", "created_at", "updated_at"]


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for Document uploads."""

    class Meta:
        model = Document
        fields = [
            "id", "expert", "file", "original_filename", "file_type",
            "file_size", "processing_status", "extracted_data",
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "expert", "original_filename", "file_type", "file_size",
            "processing_status", "extracted_data", "created_at", "updated_at",
        ]
