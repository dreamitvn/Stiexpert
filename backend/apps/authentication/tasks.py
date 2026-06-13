"""Celery tasks for email sending — async, non-blocking."""
import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_templated_email(self, template_name, context, to_email, subject):
    """
    Send an HTML email using Django template.

    Args:
        template_name: Template path under templates/emails/ (e.g. 'welcome')
        context: Dict of template context variables
        to_email: Recipient email address
        subject: Email subject line
    """
    try:
        html_content = render_to_string(f"emails/{template_name}.html", context)
        msg = EmailMultiAlternatives(
            subject=subject,
            body="",  # plaintext fallback empty — HTML is primary
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to_email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Email '{template_name}' sent to {to_email}")
        return {"status": "sent", "to": to_email, "template": template_name}
    except Exception as exc:
        logger.error(f"Failed to send '{template_name}' to {to_email}: {exc}")
        raise self.retry(exc=exc)


@shared_task
def send_welcome_email_task(user_id):
    """Send welcome email to newly registered user."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.warning(f"send_welcome_email_task: user {user_id} not found")
        return

    # Try to get expert profile info
    full_name = user.username
    sti_id = ""
    main_field = ""
    try:
        profile = user.expert_profile
        full_name = profile.full_name or user.username
        sti_id = profile.sti_id or ""
        main_field = profile.main_field or ""
    except Exception:
        pass

    context = {
        "full_name": full_name,
        "email": user.email,
        "sti_id": sti_id,
        "main_field": main_field,
        "login_url": "https://v2.stiexpert.com/auth/login",
        "dashboard_url": "https://v2.stiexpert.com/dashboard",
    }
    send_templated_email.delay(
        template_name="welcome",
        context=context,
        to_email=user.email,
        subject="🎉 Chào mừng bạn đến với STI Expert!",
    )


@shared_task
def send_password_reset_email_task(user_id, reset_url):
    """Send password reset email."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.warning(f"send_password_reset_email_task: user {user_id} not found")
        return

    full_name = user.username
    try:
        profile = user.expert_profile
        full_name = profile.full_name or user.username
    except Exception:
        pass

    context = {
        "full_name": full_name,
        "reset_url": reset_url,
    }
    send_templated_email.delay(
        template_name="password_reset",
        context=context,
        to_email=user.email,
        subject="🔑 Đặt lại mật khẩu STI Expert",
    )


@shared_task
def send_verification_success_email_task(user_id, verification_type="professional"):
    """Send verification success email when expert is approved."""
    from django.contrib.auth import get_user_model
    from django.utils import timezone
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.warning(f"send_verification_success_email_task: user {user_id} not found")
        return

    full_name = user.username
    sti_id = ""
    main_field = ""
    try:
        profile = user.expert_profile
        full_name = profile.full_name or user.username
        sti_id = profile.sti_id or ""
        main_field = profile.main_field or ""
    except Exception:
        pass

    if verification_type == "professional":
        badge_icon = "🟢"
        badge_name = "Huy hiệu Xanh — Chuyên gia Chuyên môn"
        badge_color = "xanh lá"
    else:
        badge_icon = "🟡"
        badge_name = "Huy hiệu Vàng — Xác thực Danh tính"
        badge_color = "vàng"

    context = {
        "full_name": full_name,
        "sti_id": sti_id,
        "main_field": main_field,
        "badge_icon": badge_icon,
        "badge_name": badge_name,
        "badge_color": badge_color,
        "verification_type": "Xác thực chuyên môn" if verification_type == "professional" else "Xác thực danh tính (CCCD/VNeID)",
        "verified_date": timezone.now().strftime("%d/%m/%Y"),
    }
    send_templated_email.delay(
        template_name="verification_success",
        context=context,
        to_email=user.email,
        subject=f"✅ Hồ sơ đã xác thực — {badge_name}",
    )
