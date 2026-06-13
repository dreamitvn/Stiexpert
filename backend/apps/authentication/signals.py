"""Django signals for authentication app — sends welcome email on user registration."""
import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def send_welcome_email_on_registration(sender, instance, created, **kwargs):
    """Fire-and-forget welcome email after new user creation."""
    if not created:
        return

    # Skip admin/superuser accounts
    if instance.is_superuser:
        return

    from .services.email_service import send_welcome_email

    try:
        send_welcome_email(instance)
    except Exception as e:
        # Log but never fail user creation due to email
        logger.error(f"Welcome email failed for {instance.email}: {e}")