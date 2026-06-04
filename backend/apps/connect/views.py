from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import ExpertiseRequest, Connection, Message, Review
from .serializers import (
    ExpertiseRequestSerializer, ExpertiseRequestCreateSerializer,
    ConnectionSerializer, MessageSerializer, ReviewSerializer,
)
from apps.authentication.permissions import IsBusiness, IsExpert


class ExpertiseRequestViewSet(viewsets.ModelViewSet):
    """Manage expertise requests (business users)."""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ExpertiseRequestCreateSerializer
        return ExpertiseRequestSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return ExpertiseRequest.objects.all()
        if user.role == 'business':
            return ExpertiseRequest.objects.filter(requester=user)
        # Experts can see open requests
        return ExpertiseRequest.objects.filter(status='open')

    def perform_create(self, serializer):
        request_obj = serializer.save(requester=self.request.user)
        # Trigger async AI matching
        from apps.matching.tasks import match_expertise_request
        match_expertise_request.delay(str(request_obj.id))

    @action(detail=True, methods=['get'])
    def matches(self, request, pk=None):
        """Get AI matches for this request."""
        from apps.matching.models import MatchResult
        from apps.matching.serializers import MatchResultSerializer

        expertise_request = self.get_object()
        results = MatchResult.objects.filter(request=expertise_request)
        serializer = MatchResultSerializer(results, many=True)
        return Response(serializer.data)


class ConnectionViewSet(viewsets.ModelViewSet):
    """Manage connections between businesses and experts."""
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Connection.objects.all()
        if user.role == 'business':
            return Connection.objects.filter(request__requester=user)
        # Expert sees connections to them
        return Connection.objects.filter(expert__user=user)

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Expert accepts a connection."""
        connection = self.get_object()
        connection.status = 'accepted'
        connection.save(update_fields=['status'])
        return Response(ConnectionSerializer(connection).data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        """Expert declines a connection."""
        connection = self.get_object()
        connection.status = 'cancelled'
        connection.save(update_fields=['status'])
        return Response(ConnectionSerializer(connection).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark connection as completed."""
        connection = self.get_object()
        connection.status = 'completed'
        connection.save(update_fields=['status'])
        return Response(ConnectionSerializer(connection).data)

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        """Get/send messages in a connection."""
        connection = self.get_object()

        if request.method == 'GET':
            messages = Message.objects.filter(connection=connection)
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)

        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(connection=connection, sender=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'post'])
    def review(self, request, pk=None):
        """Get/create review for a completed connection."""
        connection = self.get_object()

        if request.method == 'GET':
            try:
                review = connection.review
                return Response(ReviewSerializer(review).data)
            except Review.DoesNotExist:
                return Response({'detail': 'No review yet'}, status=status.HTTP_404_NOT_FOUND)

        if connection.status != 'completed':
            return Response(
                {'error': 'Chỉ có thể đánh giá sau khi hoàn thành hợp tác'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(connection=connection, reviewer=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
