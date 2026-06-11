from rest_framework import serializers

from apps.marketplace.models import Bid, IPAsset, Listing, Transaction
from apps.passport.serializers import ExpertProfileSerializer


class IPAssetSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.full_name", read_only=True)
    owner_sti_id = serializers.CharField(source="owner.sti_id", read_only=True)
    owner_verified = serializers.SerializerMethodField()
    token_metadata = serializers.SerializerMethodField()

    class Meta:
        model = IPAsset
        fields = [
            "id", "owner", "owner_name", "owner_sti_id", "owner_verified",
            "source_type", "source_id",
            "title", "description", "abstract", "keywords", "category",
            "thumbnail", "documents",
            "token_id", "token_standard", "token_uri", "contract_address",
            "chain_id", "tx_hash",
            "is_fractionalized", "total_fractions", "available_fractions",
            "fraction_price", "royalty_percentage",
            "is_confidential", "zkp_proof_hash",
            "vkac_credential_id",
            "created_at", "updated_at", "minted_at",
            "token_metadata",
        ]
        read_only_fields = [
            "id", "token_id", "token_uri", "contract_address", "tx_hash",
            "vkac_credential_id", "created_at", "updated_at", "minted_at",
            "owner_name", "owner_sti_id", "owner_verified", "token_metadata",
        ]

    def get_owner_verified(self, obj):
        return {
            "professional": obj.owner.professional_verified,
            "identity": obj.owner.identity_verified,
        }

    def get_token_metadata(self, obj):
        return obj.generate_token_uri_metadata()


class IPAssetMintSerializer(serializers.Serializer):
    """For minting an IP-NFT from an existing passport item."""
    source_type = serializers.ChoiceField(choices=[
        ("paper", "Paper"), ("patent", "Patent"), ("research", "Research Result")
    ])
    source_id = serializers.CharField()
    title = serializers.CharField(max_length=500)
    description = serializers.CharField(required=False, default="")
    abstract = serializers.CharField(required=False, default="")
    keywords = serializers.ListField(child=serializers.CharField(), required=False, default=[])
    category = serializers.CharField(required=False, default="")
    is_fractionalized = serializers.BooleanField(default=False)
    total_fractions = serializers.IntegerField(default=1, min_value=1, max_value=10000)
    royalty_percentage = serializers.DecimalField(
        max_digits=5, decimal_places=2, default=5.0, min_value=0, max_value=50
    )
    is_confidential = serializers.BooleanField(default=False)


class ListingSerializer(serializers.ModelSerializer):
    ip_asset_detail = IPAssetSerializer(source="ip_asset", read_only=True)
    seller_name = serializers.CharField(source="seller.full_name", read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id", "ip_asset", "ip_asset_detail", "seller", "seller_name",
            "price", "min_bid", "is_negotiable",
            "license_type", "license_terms", "license_duration_months",
            "status", "featured", "view_count",
            "created_at", "updated_at", "expires_at",
        ]
        read_only_fields = [
            "id", "seller", "seller_name", "view_count",
            "created_at", "updated_at",
        ]


class ListingCreateSerializer(serializers.Serializer):
    ip_asset_id = serializers.UUIDField()
    price = serializers.DecimalField(max_digits=18, decimal_places=2)
    min_bid = serializers.DecimalField(max_digits=18, decimal_places=2, required=False)
    is_negotiable = serializers.BooleanField(default=True)
    license_type = serializers.ChoiceField(
        choices=[c[0] for c in Listing._meta.get_field("license_type").choices],
        default="non_exclusive"
    )
    license_terms = serializers.CharField(required=False, default="")
    license_duration_months = serializers.IntegerField(required=False, allow_null=True)


class TransactionSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(
        source="listing.ip_asset.title", read_only=True
    )

    class Meta:
        model = Transaction
        fields = [
            "id", "listing", "listing_title",
            "buyer", "seller",
            "amount", "royalty_amount", "platform_fee", "escrow_amount",
            "status", "tx_hash", "escrow_contract",
            "created_at", "updated_at", "completed_at",
        ]
        read_only_fields = [
            "id", "buyer", "seller", "royalty_amount", "platform_fee",
            "escrow_amount", "tx_hash", "escrow_contract",
            "created_at", "updated_at", "completed_at",
        ]


class BidSerializer(serializers.ModelSerializer):
    bidder_name = serializers.CharField(source="bidder.get_full_name", read_only=True)

    class Meta:
        model = Bid
        fields = [
            "id", "listing", "bidder", "bidder_name",
            "amount", "message", "accepted", "created_at",
        ]
        read_only_fields = ["id", "bidder", "bidder_name", "accepted", "created_at"]
