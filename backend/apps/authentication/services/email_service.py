"""Email service for STI-Expert — sends transactional emails via SMTP."""
import logging
from pathlib import Path
from typing import Optional

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

FRONTEND_URL = getattr(settings, "FRONTEND_URL", "https://v2.stiexpert.com")
BASE_TEMPLATE_DIR = Path(settings.BASE_DIR) / "templates" / "emails"


def _render_html(template_name: str, context: dict) -> str:
    """Render HTML email template with context."""
    return render_to_string(f"emails/{template_name}.html", context)


def _send_email(
    subject: str,
    to_email: str,
    html_body: str,
    from_email: Optional[str] = None,
) -> bool:
    """Send HTML email via SMTP. Returns True on success, False on failure."""
    try:
        plain_body = strip_tags(html_body)
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_body,
            from_email=from_email or settings.DEFAULT_FROM_EMAIL,
            to=[to_email],
        )
        email.attach_alternative(html_body, "text/html")
        email.send(fail_silently=False)
        logger.info(f"Email sent: {subject} → {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False


def send_welcome_email(user) -> bool:
    """
    Send welcome email after successful registration.
    Called via post_save signal on User creation.
    """
    context = {
        "full_name": user.get_full_name() or user.email.split("@")[0],
        "email": user.email,
        "frontend_url": FRONTEND_URL,
    }
    html = _render_html("welcome", context)
    return _send_email(
        subject="🎉 Chào mừng bạn đến với STI Expert!",
        to_email=user.email,
        html_body=html,
    )


def send_password_reset_email(user, reset_url: str) -> bool:
    """
    Send password reset email with a one-time reset link.
    """
    context = {
        "full_name": user.get_full_name() or user.email.split("@")[0],
        "email": user.email,
        "reset_url": reset_url,
    }
    html = _render_html("password_reset", context)
    return _send_email(
        subject="🔑 STI Expert — Yêu cầu đặt lại mật khẩu",
        to_email=user.email,
        html_body=html,
    )