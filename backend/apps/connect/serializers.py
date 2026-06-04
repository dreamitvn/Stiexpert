from rest_framework import serializers
from .models import ExpertiseRequest, Connection, Message, Review


class ExpertiseRequestSerializer(serializers.ModelSerializer):
    requester_email = serializers.EmailField(source='requester.email', read_only=True)
    match_count = serializers.SerializerMethodField()

    class Meta:
        model = ExpertiseRequest
        fields = [
            'id', 'requester', 'requester_email', 'title', 'description',
            'fields', 'urgency', 'collaboration_type', 'region_preference',
            'status', 'match_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'requester', 'status', 'created_at', 'updated_at']

    def get_match_count(self, obj):
        return obj.match_results.count() if hasattr(obj, 'match_results') else 0

    def validate_description(self, value):
        if len(value) < 50:
            raise serializers.ValidationError("Mô tả phải có ít nhất 50 ký tự.")
        return value


class ExpertiseRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertiseRequest
        fields = ['title', 'description', 'fields', 'urgency', 'collaboration_type', 'region_preference']

    def validate_description(self, value):
        if len(value) < 50:
            raise serializers.ValidationError("Mô tả phải có ít nhất 50 ký tự.")
        return value


class ConnectionSerializer(serializers.ModelSerializer):
    expert_name = serializers.CharField(source='expert.full_name', read_only=True)
    request_title = serializers.CharField(source='request.title', read_only=True)

    class Meta:
        model = Connection
        fields = [
            'id', 'request', 'expert', 'expert_name', 'request_title',
            'match_score', 'status', 'initial_message', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'match_score', 'created_at', 'updated_at']


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'connection', 'sender', 'sender_email', 'content', 'message_type', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_email = serializers.EmailField(source='reviewer.email', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'connection', 'reviewer', 'reviewer_email', 'rating', 'comment', 'response', 'created_at']
        read_only_fields = ['id', 'reviewer', 'created_at']
