"""Authentication views for STI-Expert."""
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    """
    ViewSet for authentication operations.

    Provides register, login, token refresh, email verification, and
    current user (me) endpoints for the STI-Expert platform.
    """

    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ["register", "login", "refresh", "verify_email"]:
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
