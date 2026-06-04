"""Search service using pgvector for similarity search."""
import logging
import json
from typing import Optional

logger = logging.getLogger(__name__)


class SearchService:
    """Semantic search over expert vectors using pgvector."""

    def semantic_search(
        self,
        query: str,
        filters: Optional[dict] = None,
        limit: int = 20,
    ) -> list[dict]:
        """
        Search experts by semantic similarity.

        Args:
            query: Natural language query
            filters: dict of field filters
            limit: max results

        Returns:
            List of dicts with expert info + similarity score
        """
        from .embedding_service import EmbeddingService
        from apps.matching.models import ExpertVector
        from apps.passport.models import ExpertProfile

        embedding_service = EmbeddingService()
        query_embedding = embedding_service.embed_text(query)

        if query_embedding is None:
            # Fallback to text search if embedding model unavailable
            return self._text_search_fallback(query, filters, limit)

        # TODO: Use actual pgvector cosine similarity query:
        # ExpertVector.objects.order_by(CosineDistance('embedding', query_embedding))[:limit]
        # For now, use metadata-based filtering
        return self._text_search_fallback(query, filters, limit)

    def _text_search_fallback(
        self,
        query: str,
        filters: Optional[dict] = None,
        limit: int = 20,
    ) -> list[dict]:
        """Fallback text-based search when embedding model unavailable."""
        from apps.passport.models import ExpertProfile

        qs = ExpertProfile.objects.filter(is_public=True)

        if filters:
            if 'degree' in filters:
                qs = qs.filter(degree__icontains=filters['degree'])
            if 'organization' in filters:
                qs = qs.filter(organization__icontains=filters['organization'])

        # Basic text search across name, bio, organization
        from django.db.models import Q
        words = query.split()[:5]
        q_filter = Q()
        for word in words:
            q_filter |= (
                Q(full_name__icontains=word) |
                Q(bio__icontains=word) |
                Q(organization__icontains=word)
            )
        qs = qs.filter(q_filter)

        results = []
        for profile in qs[:limit]:
            results.append({
                'expert_id': str(profile.id),
                'full_name': profile.full_name,
                'organization': profile.organization,
                'degree': profile.degree,
                'fields': profile.fields or [],
                'similarity': 0.5,  # Placeholder score for text search
            })

        return results
