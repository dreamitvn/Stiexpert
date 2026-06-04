"""Development settings for STI-Expert."""
from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

# Use SQLite for development if no PostgreSQL available
import os

if not os.getenv("DB_NAME"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Disable throttling in development
REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = ()

# CORS - allow all in dev
CORS_ALLOW_ALL_ORIGINS = True

# Email backend
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Celery - eager mode for dev
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
