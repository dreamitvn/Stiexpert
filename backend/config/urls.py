"""URL configuration for STI-Expert."""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

from apps.authentication.models import User
from apps.passport.models import Publication, Credential, Document
from apps.matching.models import SearchLog
from apps.connect.models import ExpertiseRequest, Connection
from django.utils import timezone


def health_check(request):
    return JsonResponse({"status": "ok", "service": "sti-expert"})


def admin_stats(request):
    """Stats API for admin dashboard."""
    today = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)

    stats = {
        "users": {
            "total": User.objects.count(),
            "experts": User.objects.filter(role="expert").count(),
            "business": User.objects.filter(role="business").count(),
            "organizations": User.objects.filter(role="organization").count(),
            "verified": User.objects.filter(is_verified=True).count(),
            "new_today": User.objects.filter(created_at__gte=today).count(),
        },
        "content": {
            "publications": Publication.objects.count(),
            "credentials": Credential.objects.count(),
            "documents": Document.objects.count(),
        },
        "activity": {
            "searches": SearchLog.objects.count(),
            "connections": Connection.objects.filter(status="active").count(),
            "pending_connections": Connection.objects.filter(status="pending").count(),
            "open_requests": ExpertiseRequest.objects.filter(status="open").count(),
            "completed_requests": ExpertiseRequest.objects.filter(status="completed").count(),
        },
    }
    return JsonResponse(stats)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/health/", health_check, name="health-check"),
    path("api/v1/admin/stats/", admin_stats, name="admin-stats"),
    path("api/v1/auth/", include("apps.authentication.urls")),
    path("api/v1/passport/", include("apps.passport.urls")),
    path("api/v1/matching/", include("apps.matching.urls")),
    path("api/v1/connect/", include("apps.connect.urls")),
    path("api/v1/marketplace/", include("apps.marketplace.urls")),
    path("api/v1/news/", include("apps.news.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
