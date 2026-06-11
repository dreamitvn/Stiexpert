"""IP Marketplace — Sàn giao dịch Sở hữu Trí tuệ cho STI-Expert.

Features:
  - IP-NFT tokenization (ERC-721/ERC-1155 metadata)
  - Flexible licensing terms
  - Fractionalization for crowdfunding research
  - Royalty auto-distribution
  - ZKP-ready confidential IP metadata
  - VKAC DLT integration for verified experts only
"""
import hashlib
import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.passport.models import ExpertProfile


# ── Enums ──────────────────────────────────────────────
class IPAssetType(models.TextChoices):
    PAPER = "paper", "Công trình khoa học"
    PATENT = "patent", "Bằng sáng chế"
    INVENTION = "invention", "Giải pháp hữu ích"
    RESEARCH = "research", "Kết quả nghiên cứu"
    DATASET = "dataset", "Bộ dữ liệu"
    SOFTWARE = "software", "Phần mềm"
    OTHER = "other", "Khác"


class ListingStatus(models.TextChoices):
    DRAFT = "draft", "Bản nháp"
    ACTIVE = "active", "Đang niêm yết"
    IN_ESCROW = "in_escrow", "Đang ký quỹ"
    SOLD = "sold", "Đã bán"
    LICENSED = "licensed", "Đã cấp phép"
    CANCELLED = "cancelled", "Đã hủy"


class LicenseType(models.TextChoices):
    EXCLUSIVE = "exclusive", "Độc quyền"
    NON_EXCLUSIVE = "non_exclusive", "Không độc quyền"
    TRANSFER = "transfer", "Chuyển nhượng hoàn toàn"
    RESEARCH_ONLY = "research_only", "Chỉ nghiên cứu"
    COMMERCIAL = "commercial", "Thương mại"


class TransactionStatus(models.TextChoices):
    PENDING = "pending", "Chờ xử lý"
    ESCROW_FUNDED = "escrow_funded", "Đã ký quỹ"
    DELIVERED = "delivered", "Đã chuyển giao"
    COMPLETED = "completed", "Hoàn thành"
    DISPUTED = "disputed", "Tranh chấp"
    REFUNDED = "refunded", "Hoàn tiền"
    CANCELLED = "cancelled", "Đã hủy"


# ── IP Asset (core entity) ────────────────────────────
class IPAsset(models.Model):
    """An intellectual property asset tokenized from ExpertProfile data."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        ExpertProfile, on_delete=models.CASCADE, related_name="ip_assets"
    )
    # Source linking: which passport item this IP came from
    source_type = models.CharField(max_length=20, choices=IPAssetType.choices)
    source_id = models.CharField(
        max_length=255, blank=True, default="",
        help_text="ID of the Paper/Patent/ResearchResult this was minted from"
    )

    # Metadata
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, default="")
    abstract = models.TextField(blank=True, default="")
    keywords = models.JSONField(default=list, blank=True)
    category = models.CharField(max_length=255, blank=True, default="")
    thumbnail = models.ImageField(upload_to="marketplace/thumbnails/", blank=True, null=True)
    documents = models.JSONField(
        default=list, blank=True,
        help_text="List of document URLs/paths attached to this IP"
    )

    # Token metadata (ERC-721 / ERC-1155 compatible)
    token_id = models.CharField(
        max_length=100, unique=True, blank=True, null=True,
        help_text="On-chain token ID (populated after mint)"
    )
    token_standard = models.CharField(
        max_length=20, default="ERC-721",
        help_text="ERC-721 for unique IP, ERC-1155 for fractionalized"
    )
    token_uri = models.URLField(blank=True, default="")
    contract_address = models.CharField(max_length=100, blank=True, default="")
    chain_id = models.IntegerField(default=1, help_text="Blockchain network ID")
    tx_hash = models.CharField(max_length=100, blank=True, default="")

    # Fractionalization
    is_fractionalized = models.BooleanField(default=False)
    total_fractions = models.IntegerField(default=1)
    available_fractions = models.IntegerField(default=1)
    fraction_price = models.DecimalField(
        max_digits=18, decimal_places=2, default=0,
        help_text="Price per fraction in VND"
    )

    # Royalties
    royalty_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=5.0,
        validators=[MinValueValidator(0), MaxValueValidator(50)],
        help_text="Creator royalty % on secondary sales"
    )

    # ZKP
    zkp_proof_hash = models.CharField(
        max_length=128, blank=True, default="",
        help_text="ZK proof hash for confidential IP verification"
    )
    is_confidential = models.BooleanField(
        default=False,
        help_text="If True, full details hidden until purchase/license"
    )

    # VKAC DLT
    vkac_credential_id = models.CharField(
        max_length=255, blank=True, default="",
        help_text="VKAC DLT credential reference"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    minted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "marketplace_ip_asset"
        ordering = ["-created_at"]
        verbose_name = "IP Asset"
        verbose_name_plural = "IP Assets"

    def __str__(self):
        return f"{self.title} ({self.get_source_type_display()})"

    def generate_token_uri_metadata(self) -> dict:
        """Generate ERC-721/ERC-1155 compatible metadata JSON."""
        return {
            "name": self.title,
            "description": self.abstract or self.description,
            "image": self.thumbnail.url if self.thumbnail else "",
            "external_url": f"https://v2.stiexpert.com/marketplace/{self.id}",
            "attributes": [
                {"trait_type": "Type", "value": self.get_source_type_display()},
                {"trait_type": "Category", "value": self.category},
                {"trait_type": "Owner STI-ID", "value": self.owner.sti_id or ""},
                {"trait_type": "Royalty %", "value": str(self.royalty_percentage)},
                {"trait_type": "Fractionalized", "value": str(self.is_fractionalized)},
                {"trait_type": "Confidential", "value": str(self.is_confidential)},
            ],
        }


# ── Listing (marketplace entry) ───────────────────────
class Listing(models.Model):
    """A marketplace listing for an IP asset."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ip_asset = models.ForeignKey(
        IPAsset, on_delete=models.CASCADE, related_name="listings"
    )
    seller = models.ForeignKey(
        ExpertProfile, on_delete=models.CASCADE, related_name="listings"
    )

    # Pricing
    price = models.DecimalField(
        max_digits=18, decimal_places=2,
        help_text="Asking price in VND"
    )
    min_bid = models.DecimalField(
        max_digits=18, decimal_places=2, null=True, blank=True,
        help_text="Minimum bid for auction-style listings"
    )
    is_negotiable = models.BooleanField(default=True)

    # Licensing
    license_type = models.CharField(
        max_length=20, choices=LicenseType.choices, default=LicenseType.NON_EXCLUSIVE
    )
    license_terms = models.TextField(
        blank=True, default="",
        help_text="Detailed licensing terms and conditions"
    )
    license_duration_months = models.IntegerField(
        null=True, blank=True,
        help_text="License duration in months (null = perpetual)"
    )

    # Status
    status = models.CharField(
        max_length=20, choices=ListingStatus.choices, default=ListingStatus.DRAFT
    )

    # Visibility
    featured = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "marketplace_listing"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Listing: {self.ip_asset.title} - {self.get_status_display()}"


# ── Transaction (escrow + settlement) ─────────────────
class Transaction(models.Model):
    """Tracks a purchase or licensing transaction with escrow."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="transactions"
    )
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ip_purchases"
    )
    seller = models.ForeignKey(
        ExpertProfile, on_delete=models.CASCADE, related_name="ip_sales"
    )

    # Financials
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    royalty_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    platform_fee = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    escrow_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)

    # Status
    status = models.CharField(
        max_length=20, choices=TransactionStatus.choices, default=TransactionStatus.PENDING
    )

    # Blockchain
    tx_hash = models.CharField(max_length=100, blank=True, default="")
    escrow_contract = models.CharField(max_length=100, blank=True, default="")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "marketplace_transaction"
        ordering = ["-created_at"]

    def __str__(self):
        return f"TX {self.id}: {self.listing.ip_asset.title} ({self.get_status_display()})"


# ── Bid (for auction/negotiation) ────────────────────
class Bid(models.Model):
    """A bid or offer on a marketplace listing."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="bids"
    )
    bidder = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ip_bids"
    )
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    message = models.TextField(blank=True, default="")
    accepted = models.BooleanField(null=True)  # None = pending, True = accepted, False = rejected
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "marketplace_bid"
        ordering = ["-created_at"]
