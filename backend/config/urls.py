"""URL configuration for STI-Expert."""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({"status": "ok", "service": "sti-expert"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/health/", health_check, name="health-check"),
    path("api/v1/auth/", include("apps.authentication.urls")),
    path("api/v1/passport/", include("apps.passport.urls")),
    path("api/v1/matching/", include("apps.matching.urls")),
    path("api/v1/connect/", include("apps.connect.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
