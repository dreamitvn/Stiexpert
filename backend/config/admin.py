"""Custom admin site for STI-Expert with dashboard stats."""
from django.contrib import admin
from django.utils import timezone
from datetime import timedelta


class STIExpertAdminSite(admin.AdminSite):
    site_header = "STI-Expert Admin"
    site_title = "STI-Expert"
    index_title = "Bảng điều khiển quản trị"

    def index(self, request, extra_context=None):
        from apps.authentication.models import User
        from apps.passport.models import ExpertProfile, Publication, Credential, Document
        from apps.matching.models import SearchLog, MatchResult
        from apps.connect.models import ExpertiseRequest, Connection

        today = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)

        extra_context = extra_context or {}
        extra_context.update({
            # Users
            "user_count": User.objects.count(),
            "new_users_today": User.objects.filter(created_at__gte=today).count(),
            "expert_count": User.objects.filter(role="expert").count(),
            "business_count": User.objects.filter(role="business").count(),
            "verified_experts": User.objects.filter(role="expert", is_verified=True).count(),
            # Content
            "publication_count": Publication.objects.count(),
            "credential_count": Credential.objects.count(),
            "document_count": Document.objects.count(),
            # Activity
            "search_count": SearchLog.objects.count(),
            "connection_count": Connection.objects.filter(status="active").count(),
            "pending_connections": Connection.objects.filter(status="pending").count(),
            "active_requests": ExpertiseRequest.objects.filter(status="open").count(),
            # Recent users
            "recent_users": User.objects.order_by("-created_at")[:10],
        })
        return super().index(request, extra_context=extra_context)


# Create instance
sti_admin_site = STIExpertAdminSite(name="sti_admin")