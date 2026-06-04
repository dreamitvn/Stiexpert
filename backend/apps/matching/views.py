from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import SearchRequestSerializer, MatchResultSerializer
from .services.search_service import SearchService
from .services.scoring_service import ScoringService
from .models import SearchLog


class SemanticSearchView(views.APIView):
    """POST /api/v1/matching/search — Semantic expert search."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SearchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        query = serializer.validated_data['query']
        filters = {
            k: v for k, v in serializer.validated_data.items()
            if k not in ('query', 'limit') and v
        }
        limit = serializer.validated_data.get('limit', 20)

        # Search and score
        search_service = SearchService()
        scoring_service = ScoringService()

        # Get candidate experts
        candidates = search_service.semantic_search(query, filters=filters, limit=limit)

        # Score candidates
        results = scoring_service.score_candidates(query, candidates)

        # Log search
        SearchLog.objects.create(
            user=request.user,
            query=query,
            filters=filters,
            results_count=len(results),
        )

        return Response({
            'count': len(results),
            'results': results,
        })


class SuggestionView(views.APIView):
    """GET /api/v1/matching/suggestions — AI suggestions for business user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # TODO: Implement based on business profile and search history
        return Response({
            'suggestions': [],
            'message': 'Suggestions engine coming soon',
        })
