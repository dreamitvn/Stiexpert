from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task
def reindex_all_experts():
    """Batch re-index all expert embeddings. Scheduled via Celery Beat."""
    from apps.passport.models import ExpertProfile
    from .services.embedding_service import EmbeddingService

    service = EmbeddingService()
    experts = ExpertProfile.objects.filter(is_public=True)
    count = 0

    for profile in experts:
        try:
            service.generate_embedding(str(profile.id))
            count += 1
        except Exception as e:
            logger.error(f"Reindex failed for {profile.id}: {e}")

    logger.info(f"Reindexed {count}/{experts.count()} expert embeddings")
    return {'reindexed': count}


@shared_task
def match_expertise_request(request_id: str):
    """Find matching experts for a new expertise request."""
    from apps.connect.models import ExpertiseRequest
    from .services.search_service import SearchService
    from .services.scoring_service import ScoringService
    from .models import MatchResult

    request = ExpertiseRequest.objects.get(id=request_id)
    search = SearchService()
    scoring = ScoringService()

    candidates = search.semantic_search(request.description, limit=10)
    results = scoring.score_candidates(request.description, candidates)

    for r in results:
        MatchResult.objects.update_or_create(
            request=request,
            expert_id=r['expert_id'],
            defaults={
                'total_score': r['total_score'],
                'semantic_score': r['semantic_score'],
                'field_overlap_score': r['field_overlap_score'],
                'verified_bonus': r['verified_bonus'],
                'explanation': r['explanation'],
            }
        )

    request.status = 'matching'
    request.save(update_fields=['status'])

    logger.info(f"Matched {len(results)} experts for request {request_id}")
    return {'request_id': request_id, 'matches': len(results)}
