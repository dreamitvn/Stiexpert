from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpertProfileViewSet, PublicationViewSet, CredentialViewSet, DocumentViewSet

router = DefaultRouter()
router.register(r'experts', ExpertProfileViewSet, basename='expert')
router.register(r'publications', PublicationViewSet, basename='publication')
router.register(r'credentials', CredentialViewSet, basename='credential')
router.register(r'documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
]
