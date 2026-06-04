"""Match scoring service — weighted multi-factor scoring."""
import logging

logger = logging.getLogger(__name__)


class ScoringService:
    """Calculate match scores between expertise requests and experts."""

    # Scoring weights
    SEMANTIC_WEIGHT = 0.60
    FIELD_OVERLAP_WEIGHT = 0.20
    VERIFIED_BONUS_WEIGHT = 0.20

    THRESHOLD = 50  # Minimum score to include in results

    def score_candidates(self, query: str, candidates: list[dict]) -> list[dict]:
        """
        Score and rank a list of candidate experts.

        Args:
            query: The expertise request description
            candidates: List of candidate dicts from SearchService

        Returns:
            Sorted list with scoring breakdown
        """
        scored = []

        for candidate in candidates:
            semantic = candidate.get('similarity', 0) * 100  # 0-100
            field_overlap = self._calc_field_overlap(query, candidate.get('fields', []))
            verified = self._calc_verified_bonus(candidate.get('expert_id', ''))

            total = (
                semantic * self.SEMANTIC_WEIGHT +
                field_overlap * self.FIELD_OVERLAP_WEIGHT +
                verified * self.VERIFIED_BONUS_WEIGHT
            )

            if total >= self.THRESHOLD:
                scored.append({
                    'expert_id': candidate['expert_id'],
                    'full_name': candidate['full_name'],
                    'organization': candidate.get('organization'),
                    'degree': candidate.get('degree'),
                    'fields': candidate.get('fields', []),
                    'total_score': round(total, 1),
                    'semantic_score': round(semantic * self.SEMANTIC_WEIGHT, 1),
                    'field_overlap_score': round(field_overlap * self.FIELD_OVERLAP_WEIGHT, 1),
                    'verified_bonus': round(verified * self.VERIFIED_BONUS_WEIGHT, 1),
                    'explanation': self._generate_explanation(candidate, semantic, field_overlap, verified),
                })

        scored.sort(key=lambda x: x['total_score'], reverse=True)
        return scored

    def _calc_field_overlap(self, query: str, fields: list[str]) -> float:
        """Calculate field overlap score (0-100)."""
        if not fields:
            return 0
        query_lower = query.lower()
        matches = sum(1 for f in fields if f.lower() in query_lower)
        return min(100, (matches / max(len(fields), 1)) * 100)

    def _calc_verified_bonus(self, expert_id: str) -> float:
        """Calculate bonus based on verified credentials (0-100)."""
        try:
            from apps.passport.models import ExpertProfile
            profile = ExpertProfile.objects.get(id=expert_id)
            verified_count = profile.credentials.filter(status='issued').count()
            # Max bonus at 5+ verified credentials
            return min(100, verified_count * 20)
        except Exception:
            return 0

    def _generate_explanation(
        self,
        candidate: dict,
        semantic: float,
        field_overlap: float,
        verified: float,
    ) -> str:
        """Generate human-readable match explanation."""
        parts = []
        if semantic > 60:
            parts.append(f"Hồ sơ rất phù hợp về mặt ngữ nghĩa")
        elif semantic > 30:
            parts.append(f"Hồ sơ có liên quan")

        if field_overlap > 50:
            fields = ', '.join(candidate.get('fields', [])[:3])
            parts.append(f"trùng lĩnh vực: {fields}")

        if verified > 0:
            parts.append(f"có chứng chỉ xác thực")

        return ". ".join(parts) + "." if parts else "Kết quả phù hợp cơ bản."
