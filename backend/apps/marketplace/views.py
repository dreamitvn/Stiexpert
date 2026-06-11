import hashlib
from decimal import Decimal

from django.db.models import Q, Sum
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.marketplace.models import Bid, IPAsset, Listing, Transaction
from apps.marketplace.serializers import (
    BidSerializer,
    IPAssetMintSerializer,
    IPAssetSerializer,
    ListingCreateSerializer,
    ListingSerializer,
    TransactionSerializer,
)
from apps.passport.models import ExpertProfile, Paper, Patent, ResearchResult

PLATFORM_FEE_PERCENT = Decimal("2.5")


class IsVerifiedExpert(permissions.BasePermission):
    """Only experts with green or gold badge can list IP assets."""
    message = "Chỉ chuyên gia có Tích xanh hoặc Tích vàng mới được niêm yết."

    def has_permission(self, request, view):
        if view.action in ("list", "retrieve", "stats"):
            return True
        try:
            profile = ExpertProfile.objects.get(user=request.user)
            return profile.professional_verified or profile.identity_verified
        except ExpertProfile.DoesNotExist:
            return False


# ── IP Asset ViewSet ───────────────────────────────────
class IPAssetViewSet(viewsets.ModelViewSet):
    serializer_class = IPAssetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsVerifiedExpert]

    def get_queryset(self):
        qs = IPAsset.objects.select_related("owner").all()
        if self.action in ("list",):
            # Public: only show non-confidential or owned
            if self.request.user.is_authenticated:
                qs = qs.filter(
                    Q(is_confidential=False) | Q(owner__user=self.request.user)
                )
            else:
                qs = qs.filter(is_confidential=False)
        return qs

    def perform_create(self, serializer):
        profile = ExpertProfile.objects.get(user=self.request.user)
        serializer.save(owner=profile)

    @action(detail=False, methods=["get"])
    def my_assets(self, request):
        """List IP assets owned by the current user."""
        try:
            profile = ExpertProfile.objects.get(user=request.user)
        except ExpertProfile.DoesNotExist:
            return Response([])
        qs = IPAsset.objects.filter(owner=profile)
        return Response(IPAssetSerializer(qs, many=True).data)

    @action(detail=False, methods=["post"])
    def mint(self, request):
        """Mint an IP-NFT from an existing passport item (paper/patent/research)."""
        ser = IPAssetMintSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        d = ser.validated_data

        try:
            profile = ExpertProfile.objects.get(user=request.user)
        except ExpertProfile.DoesNotExist:
            return Response(
                {"error": "Expert profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if not (profile.professional_verified or profile.identity_verified):
            return Response(
                {"error": "Chỉ chuyên gia có Tích xanh/Tích vàng mới được mint IP-NFT."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Verify source exists
        source_map = {"paper": Paper, "patent": Patent, "research": ResearchResult}
        model_cls = source_map.get(d["source_type"])
        if not model_cls:
            return Response({"error": "Invalid source_type"}, status=400)

        if not model_cls.objects.filter(id=d["source_id"], expert=profile).exists():
            return Response({"error": "Source item not found in your profile"}, status=404)

        # Check duplicate
        if IPAsset.objects.filter(
            owner=profile, source_type=d["source_type"], source_id=d["source_id"]
        ).exists():
            return Response({"error": "This item is already tokenized"}, status=409)

        # Create IP Asset
        ip = IPAsset.objects.create(
            owner=profile,
            source_type=d["source_type"],
            source_id=str(d["source_id"]),
            title=d["title"],
            description=d.get("description", ""),
            abstract=d.get("abstract", ""),
            keywords=d.get("keywords", []),
            category=d.get("category", ""),
            is_fractionalized=d.get("is_fractionalized", False),
            total_fractions=d.get("total_fractions", 1),
            available_fractions=d.get("total_fractions", 1),
            royalty_percentage=d.get("royalty_percentage", Decimal("5.0")),
            is_confidential=d.get("is_confidential", False),
            minted_at=timezone.now(),
        )

        # Generate ZKP hash placeholder
        raw = f"{profile.sti_id}|{ip.source_type}|{ip.source_id}|{ip.title}"
        ip.zkp_proof_hash = hashlib.sha256(raw.encode()).hexdigest()
        ip.save(update_fields=["zkp_proof_hash"])

        return Response(IPAssetSerializer(ip).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Marketplace statistics."""
        return Response({
            "total_assets": IPAsset.objects.count(),
            "total_listings": Listing.objects.filter(status="active").count(),
            "total_transactions": Transaction.objects.filter(status="completed").count(),
            "total_volume": str(
                Transaction.objects.filter(status="completed")
                .aggregate(total=Sum("amount"))["total"] or 0
            ),
        })


# ── Listing ViewSet ────────────────────────────────────
class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Listing.objects.select_related("ip_asset", "ip_asset__owner", "seller").all()

        # Filters
        asset_type = self.request.query_params.get("type")
        if asset_type:
            qs = qs.filter(ip_asset__source_type=asset_type)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(ip_asset__category__icontains=category)

        search = self.request.query_params.get("q")
        if search:
            qs = qs.filter(
                Q(ip_asset__title__icontains=search)
                | Q(ip_asset__description__icontains=search)
                | Q(ip_asset__keywords__contains=[search])
            )

        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        elif self.action == "list":
            qs = qs.filter(status="active")

        return qs

    @action(detail=False, methods=["post"])
    def create_listing(self, request):
        """Create a new listing for an owned IP asset."""
        ser = ListingCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        d = ser.validated_data

        try:
            profile = ExpertProfile.objects.get(user=request.user)
        except ExpertProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

        try:
            ip_asset = IPAsset.objects.get(id=d["ip_asset_id"], owner=profile)
        except IPAsset.DoesNotExist:
            return Response({"error": "IP asset not found"}, status=404)

        listing = Listing.objects.create(
            ip_asset=ip_asset,
            seller=profile,
            price=d["price"],
            min_bid=d.get("min_bid"),
            is_negotiable=d.get("is_negotiable", True),
            license_type=d.get("license_type", "non_exclusive"),
            license_terms=d.get("license_terms", ""),
            license_duration_months=d.get("license_duration_months"),
            status="active",
        )
        return Response(ListingSerializer(listing).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def place_bid(self, request, pk=None):
        """Place a bid on a listing."""
        listing = self.get_object()
        if listing.status != "active":
            return Response({"error": "Listing is not active"}, status=400)

        amount = request.data.get("amount")
        message = request.data.get("message", "")

        if not amount:
            return Response({"error": "Amount is required"}, status=400)

        bid = Bid.objects.create(
            listing=listing,
            bidder=request.user,
            amount=Decimal(str(amount)),
            message=message,
        )
        return Response(BidSerializer(bid).data, status=status.HTTP_201_CREATED)


# ── Transaction ViewSet ────────────────────────────────
class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(
            Q(buyer=user) | Q(seller__user=user)
        ).select_related("listing", "listing__ip_asset", "seller")

    @action(detail=False, methods=["get"])
    def my_transactions(self, request):
        """All transactions for the current user (as buyer or seller)."""
        qs = self.get_queryset()
        return Response(TransactionSerializer(qs, many=True).data)
