"""Authentication app configuration — registers signals on Django startup."""
from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.authentication"

    def ready(self):
        # Import signal handlers to register them
        from . import signals  # noqa: F401