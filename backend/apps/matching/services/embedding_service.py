"""Embedding service using PhoBERT + Sentence Transformers."""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Generate vector embeddings for expert profiles."""

    MODEL_NAME = "VoVanPhuc/sup-SimCSE-VietNamese-phobert-base"
    VECTOR_DIM = 768

    def __init__(self):
        self._model = None

    def _load_model(self):
        """Lazy-load the embedding model."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.MODEL_NAME)
                logger.info(f"Loaded embedding model: {self.MODEL_NAME}")
            except ImportError:
                logger.warning("sentence-transformers not installed")
                return None
        return self._model

    def generate_embedding(self, expert_id: str) -> Optional[list[float]]:
        """
        Generate embedding for an expert profile by combining profile text + publications.

        Args:
            expert_id: UUID of the expert profile

        Returns:
            768-dim embedding vector as list of floats, or None on failure
        """
        from apps.passport.models import ExpertProfile
        from apps.matching.models import ExpertVector

        profile = ExpertProfile.objects.prefetch_related('publications').get(id=expert_id)

        # Combine text sources
        text_parts = [
            profile.full_name or "",
            profile.bio or "",
            f"Lĩnh vực: {', '.join(profile.fields or [])}",
            f"Tổ chức: {profile.organization or ''}",
            f"Chức danh: {profile.title or ''}",
        ]

        # Add publication abstracts
        for pub in profile.publications.all()[:20]:
            if pub.abstract:
                text_parts.append(pub.abstract[:500])
            elif pub.title:
                text_parts.append(pub.title)

        combined_text = " ".join(text_parts).strip()
        if not combined_text:
            logger.warning(f"No text content for expert {expert_id}")
            return None

        model = self._load_model()
        if model is None:
            # Fallback: store placeholder
            import json
            vector, _ = ExpertVector.objects.update_or_create(
                expert=profile,
                defaults={
                    'embedding': json.dumps([0.0] * self.VECTOR_DIM),
                    'metadata': self._build_metadata(profile),
                }
            )
            return None

        embedding = model.encode(combined_text).tolist()

        import json
        ExpertVector.objects.update_or_create(
            expert=profile,
            defaults={
                'embedding': json.dumps(embedding),
                'metadata': self._build_metadata(profile),
            }
        )

        return embedding

    def embed_text(self, text: str) -> Optional[list[float]]:
        """Embed arbitrary text for search queries."""
        model = self._load_model()
        if model is None:
            return None
        return model.encode(text).tolist()

    def _build_metadata(self, profile) -> dict:
        """Build cached metadata for filtering."""
        return {
            'full_name': profile.full_name,
            'organization': profile.organization,
            'degree': profile.degree,
            'fields': profile.fields or [],
            'nationality': profile.nationality,
            'publication_count': profile.publications.count(),
            'verified_count': profile.credentials.filter(status='issued').count(),
        }
