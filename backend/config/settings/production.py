"""Production settings for STI-Expert."""
from .base import *  # noqa: F401,F403

DEBUG = False

# Cloudflare handles SSL termination, so disable redirect
SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Security
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = [
    "https://v2.stiexpert.com",
]

# Email
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
