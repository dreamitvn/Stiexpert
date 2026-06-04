from rest_framework import serializers
from .models import ExpertVector, MatchResult, SearchLog


class SearchRequestSerializer(serializers.Serializer):
    """Input for semantic expert search."""
    query = serializers.CharField(max_length=2000, help_text="Natural language search query")
    fields = serializers.ListField(child=serializers.CharField(), required=False)
    degree = serializers.CharField(max_length=50, required=False)
    organization = serializers.CharField(max_length=255, required=False)
    region = serializers.CharField(max_length=100, required=False)
    limit = serializers.IntegerField(default=20, min_value=1, max_value=100)


class MatchResultSerializer(serializers.ModelSerializer):
    expert_name = serializers.CharField(source='expert.full_name', read_only=True)
    expert_organization = serializers.CharField(source='expert.organization', read_only=True)
    expert_id = serializers.UUIDField(source='expert.id', read_only=True)

    class Meta:
        model = MatchResult
        fields = [
            'id', 'expert_id', 'expert_name', 'expert_organization',
            'total_score', 'semantic_score', 'field_overlap_score',
            'verified_bonus', 'explanation', 'created_at',
        ]


class SearchLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchLog
        fields = ['id', 'query', 'filters', 'results_count', 'created_at']
