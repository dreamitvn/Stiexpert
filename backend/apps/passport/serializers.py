"""Passport serializers for STI-Expert."""
from rest_framework import serializers

from .models import ExpertProfile, Publication, Credential, Document


class ExpertProfileSerializer(serializers.ModelSerializer):
    """Serializer for ExpertProfile CRUD."""

    profile_completeness = serializers.IntegerField(read_only=True)

    class Meta:
        model = ExpertProfile
        fields = [
            "id", "user", "full_name", "orcid", "organization", "title",
            "degree", "fields", "nationality", "bio", "avatar", "did_uri",
            "profile_completeness", "is_public", "privacy_settings",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "did_uri", "profile_completeness", "created_at", "updated_at"]


class PublicExpertProfileSerializer(serializers.ModelSerializer):
    """Serializer for public expert profile view (limited fields)."""

    publications_count = serializers.IntegerField(source="publications.count", read_only=True)
    credentials_count = serializers.IntegerField(source="credentials.count", read_only=True)

    class Meta:
        model = ExpertProfile
        fields = [
            "id", "full_name", "organization", "title", "degree",
            "fields", "bio", "avatar", "publications_count", "credentials_count",
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
