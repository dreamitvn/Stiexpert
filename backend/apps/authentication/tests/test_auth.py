"""Tests for authentication app."""
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestAuth:
    """Test cases for authentication."""

    def test_user_creation(self):
        """Test that a user can be created with required fields."""
        user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="securepass123",
            role=User.Role.EXPERT,
        )
        assert user.email == "test@example.com"
        assert user.role == "expert"
        assert user.is_verified is False
        assert user.check_password("securepass123")

    def test_user_str(self):
        """Test user string representation."""
        user = User(email="user@example.com", username="user", role=User.Role.EXPERT)
        assert "user@example.com" in str(user)
        assert "expert" in str(user)