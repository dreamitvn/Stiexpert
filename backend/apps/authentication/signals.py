"""Django signals for authentication app — sends welcome email on user registration via Celery."""
import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def send_welcome_email_on_registration(sender, instance, created, **kwargs):
    """Fire-and-forget welcome email after new user creation (async via Celery)."""
    if not created:
        return

    # Skip admin/superuser accounts
    if instance.is_superuser:
        return

    from .tasks import send_welcome_email_task

    try:
        send_welcome_email_task.delay(str(instance.id))
    except Exception as e:
        # Log but never fail user creation due to email
        logger.error(f"Welcome email task dispatch failed for {instance.email}: {e}")