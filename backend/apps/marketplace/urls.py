from rest_framework.routers import DefaultRouter

from apps.marketplace.views import IPAssetViewSet, ListingViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r"ip-assets", IPAssetViewSet, basename="ip-asset")
router.register(r"listings", ListingViewSet, basename="listing")
router.register(r"transactions", TransactionViewSet, basename="transaction")

urlpatterns = router.urls
