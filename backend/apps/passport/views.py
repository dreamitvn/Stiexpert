from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from .models import ExpertProfile, Publication, Credential, Document
from .serializers import (
    ExpertProfileSerializer,
    PublicExpertProfileSerializer as ExpertProfilePublicSerializer,
    PublicationSerializer,
    CredentialSerializer,
    DocumentSerializer,
)
from apps.authentication.permissions import IsExpert, IsAdmin


class ExpertProfileViewSet(viewsets.ModelViewSet):
    """Expert profile management."""
    serializer_class = ExpertProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            return ExpertProfile.objects.filter(is_public=True)
        return ExpertProfile.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'public']:
            return [AllowAny()]
        if self.action == 'me':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsExpert()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'public']:
            return ExpertProfilePublicSerializer
        return ExpertProfileSerializer

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current user's expert profile."""
        profile, created = ExpertProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.email}
        )
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def orcid_import(self, request):
        """Import publications from ORCID."""
        orcid_id = request.data.get('orcid_id')
        if not orcid_id:
            return Response({'error': 'orcid_id required'}, status=status.HTTP_400_BAD_REQUEST)
        # TODO: Implement ORCID API fetch
        from .services.orcid_service import OrcidService
        service = OrcidService()
        publications = service.fetch_publications(orcid_id)
        return Response({'imported': len(publications), 'publications': publications})


class PublicationViewSet(viewsets.ModelViewSet):
    """Publication CRUD for authenticated experts."""
    serializer_class = PublicationSerializer
    permission_classes = [IsAuthenticated, IsExpert]

    def get_queryset(self):
        return Publication.objects.filter(expert__user=self.request.user)

    def perform_create(self, serializer):
        profile = ExpertProfile.objects.get(user=self.request.user)
        serializer.save(expert=profile)


class CredentialViewSet(viewsets.ReadOnlyModelViewSet):
    """Verifiable Credentials - read only for experts, admin can issue."""
    serializer_class = CredentialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Credential.objects.all()
        return Credential.objects.filter(expert__user=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def verify(self, request, pk=None):
        """Public verification endpoint for a VC."""
        credential = get_object_or_404(Credential, pk=pk)
        # TODO: Implement actual VC verification via SpruceID
        return Response({
            'valid': credential.status == 'issued',
            'credential_type': credential.credential_type,
            'issued_at': credential.issued_at,
            'issuer_did': credential.issuer_did,
        })


class DocumentViewSet(viewsets.ModelViewSet):
    """Document upload and management."""
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsExpert]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        return Document.objects.filter(expert__user=self.request.user)

    def perform_create(self, serializer):
        profile = ExpertProfile.objects.get(user=self.request.user)
        doc = serializer.save(expert=profile)
        # Trigger async PDF extraction
        from .tasks import process_document
        process_document.delay(str(doc.id))
