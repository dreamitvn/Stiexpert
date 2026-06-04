from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpertiseRequestViewSet, ConnectionViewSet

router = DefaultRouter()
router.register(r'requests', ExpertiseRequestViewSet, basename='expertise-request')
router.register(r'connections', ConnectionViewSet, basename='connection')

urlpatterns = [
    path('', include(router.urls)),
]
