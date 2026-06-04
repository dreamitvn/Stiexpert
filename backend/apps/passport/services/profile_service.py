"""Profile management service."""
import logging

logger = logging.getLogger(__name__)


class ProfileService:
    """Business logic for expert profile operations."""

    COMPLETENESS_FIELDS = [
        'full_name', 'orcid', 'organization', 'title',
        'degree', 'fields', 'nationality', 'bio', 'avatar',
    ]

    @classmethod
    def calculate_completeness(cls, profile) -> int:
        """Calculate profile completeness percentage (0-100)."""
        filled = 0
        total = len(cls.COMPLETENESS_FIELDS)

        for field in cls.COMPLETENESS_FIELDS:
            value = getattr(profile, field, None)
            if value:
                if isinstance(value, (list, dict)) and len(value) == 0:
                    continue
                filled += 1

        # Bonus: has publications
        if hasattr(profile, 'publications') and profile.publications.exists():
            filled += 1
            total += 1

        return int((filled / total) * 100) if total > 0 else 0
