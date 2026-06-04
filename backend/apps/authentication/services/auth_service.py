"""Authentication service for STI-Expert."""
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthService:
    """Service layer for authentication operations."""

    @staticmethod
    def create_user(email: str, username: str, password: str, role: str = "expert", **kwargs) -> "User":
        """Create a new user with hashed password."""
        user = User(email=email, username=username, role=role, **kwargs)
        user.set_password(password)
        user.save()
        return user

    @staticmethod
    def verify_email(user: "User") -> None:
        """Mark user email as verified."""
        user.is_verified = True
        user.save(update_fields=["is_verified"])

    @staticmethod
    def generate_verification_token(user: "User") -> str:
        """Generate an email verification token."""
        # TODO: Implement token generation (e.g., itsdangerous or Django signing)
        from django.core.signing import TimestampSigner
        signer = TimestampSigner()
        return signer.sign(str(user.id))

    @staticmethod
    def validate_verification_token(token: str) -> "User | None":
        """Validate an email verification token and return the user."""
        # TODO: Implement token validation
        from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
        signer = TimestampSigner()
        try:
            user_id = signer.unsign(token, max_age=86400)  # 24h expiry
            return User.objects.get(id=user_id)
        except (BadSignature, SignatureExpired, User.DoesNotExist):
            return None
