"""Authentication views for STI-Expert."""
import secrets

from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework_simplejwt.tokens import RefreshToken

from .models import PasswordResetToken
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .tasks import send_welcome_email_task, send_password_reset_email_task

User = get_user_model()

FRONTEND_URL = "https://v2.stiexpert.com"


class AuthViewSet(viewsets.GenericViewSet):
    """
    ViewSet for authentication operations.

    Provides register, login, token refresh, email verification,
    forgot_password, reset_password, change_password,
    and current user (me) endpoints for the STI-Expert platform.
    """

    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in [
            "register", "login", "refresh", "verify_email",
            "forgot_password", "reset_password",
        ]:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["post"], serializer_class=RegisterSerializer)
    def register(self, request):
        """Register a new user account and return JWT tokens for auto-login."""
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        access["role"] = user.role
        access["email"] = user.email
        return Response(
            {
                "success": True,
                "data": {
                    "user": UserSerializer(user).data,
                    "access": str(access),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"], serializer_class=LoginSerializer)
    def login(self, request):
        """Authenticate and obtain JWT tokens."""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {"success": True, "data": serializer.validated_data},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"])
    def refresh(self, request):
        """Refresh an access token using a refresh token."""
        from rest_framework_simplejwt.serializers import TokenRefreshSerializer

        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {"success": True, "data": serializer.validated_data},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"])
    def verify_email(self, request):
        """Verify a user's email address using a token."""
        # TODO: Implement email verification with token
        token = request.data.get("token")
        if not token:
            return Response(
                {"success": False, "error": "Token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"success": True, "message": "Email verified successfully."},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get", "patch"])
    def me(self, request):
        """Get or update the current authenticated user's info."""
        if request.method == "GET":
            serializer = UserSerializer(request.user)
            return Response({"success": True, "data": serializer.data})

        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "data": serializer.data})

    @action(detail=False, methods=["post"])
    def forgot_password(self, request):
        """
        Send password reset email.
        Accepts: {"email": "user@example.com"}
        Always returns 200 (to prevent email enumeration).
        """
        email = request.data.get("email", "").strip().lower()
        if not email:
            return Response(
                {"success": False, "error": "Email là bắt buộc."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Always respond success to prevent email enumeration
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"success": True, "message": "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu."},
            )

        # Invalidate old tokens
        PasswordResetToken.objects.filter(user=user, used=False).update(used=True)

        # Create new token
        token_str = secrets.token_urlsafe(48)
        PasswordResetToken.objects.create(user=user, token=token_str)

        # Build reset URL
        reset_url = f"{FRONTEND_URL}/auth/reset-password?token={token_str}"

        # Dispatch async email via Celery
        send_password_reset_email_task.delay(str(user.id), reset_url)

        return Response(
            {"success": True, "message": "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu."},
        )

    @action(detail=False, methods=["post"])
    def reset_password(self, request):
        """
        Reset password using token from email link.
        Accepts: {"token": "...", "password": "...", "password_confirm": "..."}
        """
        token_str = request.data.get("token", "")
        password = request.data.get("password", "")
        password_confirm = request.data.get("password_confirm", "")

        if not token_str or not password:
            return Response(
                {"success": False, "error": "Token và mật khẩu là bắt buộc."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password != password_confirm:
            return Response(
                {"success": False, "error": "Mật khẩu xác nhận không khớp."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password) < 8:
            return Response(
                {"success": False, "error": "Mật khẩu phải ít nhất 8 ký tự."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            reset_token = PasswordResetToken.objects.get(token=token_str)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"success": False, "error": "Token không hợp lệ hoặc đã hết hạn."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not reset_token.is_valid:
            return Response(
                {"success": False, "error": "Token đã được sử dụng hoặc hết hạn."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Set new password
        user = reset_token.user
        user.set_password(password)
        user.save()

        # Mark token as used
        reset_token.used = True
        reset_token.save()

        return Response(
            {"success": True, "message": "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay."},
        )

    @action(detail=False, methods=["post"])
    def change_password(self, request):
        """
        Change password for authenticated user.
        Accepts: {"old_password": "...", "new_password": "...", "new_password_confirm": "..."}
        """
        old_password = request.data.get("old_password", "")
        new_password = request.data.get("new_password", "")
        new_password_confirm = request.data.get("new_password_confirm", "")

        if not old_password or not new_password:
            return Response(
                {"success": False, "error": "Mật khẩu cũ và mới là bắt buộc."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != new_password_confirm:
            return Response(
                {"success": False, "error": "Mật khẩu mới xác nhận không khớp."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {"success": False, "error": "Mật khẩu mới phải ít nhất 8 ký tự."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.user.check_password(old_password):
            return Response(
                {"success": False, "error": "Mật khẩu hiện tại không đúng."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(new_password)
        request.user.save()

        return Response(
            {"success": True, "message": "Đổi mật khẩu thành công!"},
        )
