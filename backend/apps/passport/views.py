from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone

from .models import ExpertProfile, Publication, Credential, Document
from .serializers import (
    ExpertProfileSerializer,
    PublicExpertProfileSerializer as ExpertProfilePublicSerializer,
    PublicationSerializer,
    CredentialSerializer,
    DocumentSerializer,
)
from apps.authentication.permissions import IsExpert, IsAdmin, IsManagerOrAdmin, IsVerificationStaffOrAdmin


class ExpertProfileViewSet(viewsets.ModelViewSet):
    """Expert profile management."""
    serializer_class = ExpertProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from django.db.models import Count, Case, When, IntegerField, Q

        user = getattr(self.request, 'user', None)
        is_staff_user = (
            user and user.is_authenticated
            and (getattr(user, 'role', '') in {'admin', 'manager', 'verification_staff'} or user.is_staff)
        )

        # Annotate completeness score using distinct=True to prevent Cartesian product multiplication
        base_qs = ExpertProfile.objects.annotate(
            _completeness=Count('experiences', distinct=True) 
                            + Count('education', distinct=True) 
                            + Count('certificates', distinct=True)
                            + Count('awards', distinct=True) 
                            + Count('papers', distinct=True) 
                            + Count('projects', distinct=True)
                            + Count('science_activities', distinct=True) 
                            + Count('associations', distinct=True)
                            + Count('patents', distinct=True) 
                            + Count('research_results', distinct=True),
        ).annotate(
            _badge_score=Case(
                When(professional_verified=True, identity_verified=True, then=3),
                When(professional_verified=True, then=2),
                When(identity_verified=True, then=1),
                default=0,
                output_field=IntegerField(),
            ),
            _has_avatar=Case(
                When(Q(avatar__isnull=False) & ~Q(avatar=''), then=1),
                default=0,
                output_field=IntegerField(),
            )
        )

        # Order of priority: 
        # 1. Badge status (Green + Gold -> Green -> Gold -> None)
        # 2. Has avatar (Profiles with avatar first)
        # 3. Completeness score (more associated information sections first)
        # 4. Fallback to registration/creation date
        ordering = ['-_badge_score', '-_has_avatar', '-_completeness', '-created_at']

        if self.action == 'list' and not is_staff_user:
            return base_qs.filter(is_public=True).order_by(*ordering)
        elif self.action == 'list':
            return base_qs.order_by(*ordering)
        return ExpertProfile.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'public', 'stats']:
            return [AllowAny()]
        if self.action == 'me':
            return [IsAuthenticated()]
        if self.action in ['approve_professional', 'reject_professional']:
            return [IsManagerOrAdmin()]
        if self.action in ['approve_identity', 'reject_identity']:
            return [IsVerificationStaffOrAdmin()]
        return [IsAuthenticated(), IsExpert()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'public']:
            return ExpertProfilePublicSerializer
        return ExpertProfileSerializer

    def get_object(self):
        if self.action == 'retrieve':
            lookup = self.kwargs.get(self.lookup_url_kwarg or self.lookup_field)
            if lookup and len(lookup) > 8 and '-' in lookup:
                short_id = lookup.rsplit('-', 1)[-1]
                if len(short_id) == 8:
                    return get_object_or_404(self.get_queryset(), id__startswith=short_id)
        return super().get_object()

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

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='stats')
    def stats(self, request):
        """Public stats for homepage."""
        total = ExpertProfile.objects.count()
        with_avatar = ExpertProfile.objects.exclude(avatar__exact='').exclude(avatar__isnull=True).count()
        green = ExpertProfile.objects.filter(professional_verified=True).count()
        gold = ExpertProfile.objects.filter(identity_verified=True).count()
        fields_count = 22  # chuyên gia 22 nhóm thông tin
        return Response({
            "total_experts": total,
            "with_avatar": with_avatar,
            "green_badge": green,
            "gold_badge": gold,
            "fields_count": fields_count,
        })

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

    @action(detail=True, methods=['post'], permission_classes=[IsManagerOrAdmin])
    def approve_professional(self, request, pk=None):
        """Manager/admin approve professional (green) badge."""
        profile = self.get_object()
        profile.professional_verified = True
        profile.professional_verification_status = "approved"
        profile.professional_verified_at = timezone.now()
        profile.professional_verified_by = request.user
        profile.professional_verification_note = request.data.get("note", "")
        profile.save(update_fields=[
            "professional_verified", "professional_verification_status",
            "professional_verified_at", "professional_verified_by",
            "professional_verification_note",
        ])

        # Send async verification success email via Celery
        from apps.authentication.tasks import send_verification_success_email_task
        send_verification_success_email_task.delay(str(profile.user.id), "professional")

        return Response({"status": "approved", "badge": "professional"})

    @action(detail=True, methods=['post'], permission_classes=[IsManagerOrAdmin])
    def reject_professional(self, request, pk=None):
        """Manager/admin reject professional badge."""
        profile = self.get_object()
        profile.professional_verified = False
        profile.professional_verification_status = "rejected"
        profile.professional_verified_at = timezone.now()
        profile.professional_verified_by = request.user
        profile.professional_verification_note = request.data.get("note", "")
        profile.save(update_fields=[
            "professional_verified", "professional_verification_status",
            "professional_verified_at", "professional_verified_by",
            "professional_verification_note",
        ])
        return Response({"status": "rejected", "badge": "professional"})

    @action(detail=True, methods=['post'], permission_classes=[IsVerificationStaffOrAdmin])
    def approve_identity(self, request, pk=None):
        """Verification staff/admin approve identity (gold) badge."""
        profile = self.get_object()
        profile.identity_verified = True
        profile.identity_verification_status = "approved"
        profile.identity_verified_at = timezone.now()
        profile.identity_verified_by = request.user
        profile.identity_verification_note = request.data.get("note", "")
        profile.save(update_fields=[
            "identity_verified", "identity_verification_status",
            "identity_verified_at", "identity_verified_by",
            "identity_verification_note",
        ])

        # Send async verification success email via Celery
        from apps.authentication.tasks import send_verification_success_email_task
        send_verification_success_email_task.delay(str(profile.user.id), "identity")

        return Response({"status": "approved", "badge": "identity"})

    @action(detail=True, methods=['post'], permission_classes=[IsVerificationStaffOrAdmin])
    def reject_identity(self, request, pk=None):
        """Verification staff/admin reject identity badge."""
        profile = self.get_object()
        profile.identity_verified = False
        profile.identity_verification_status = "rejected"
        profile.identity_verified_at = timezone.now()
        profile.identity_verified_by = request.user
        profile.identity_verification_note = request.data.get("note", "")
        profile.save(update_fields=[
            "identity_verified", "identity_verification_status",
            "identity_verified_at", "identity_verified_by",
            "identity_verification_note",
        ])
        return Response({"status": "rejected", "badge": "identity"})


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
