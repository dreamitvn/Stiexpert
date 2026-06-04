import uuid
from django.db import models
from django.conf import settings


class ExpertVector(models.Model):
    """Vector embedding for expert profile, stored in pgvector."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    expert = models.OneToOneField(
        'passport.ExpertProfile',
        on_delete=models.CASCADE,
        related_name='vector',
    )
    # pgvector field — 768 dims for PhoBERT
    # Using TextField as fallback; actual pgvector type set via migration
    embedding = models.TextField(blank=True, null=True, help_text="768-dim vector (pgvector)")
    metadata = models.JSONField(default=dict, blank=True, help_text="Cached fields for filtering")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'expert_vectors'

    def __str__(self):
        return f"Vector for {self.expert.full_name}"


class MatchResult(models.Model):
    """Stores matching results between expertise requests and experts."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(
        'connect.ExpertiseRequest',
        on_delete=models.CASCADE,
        related_name='match_results',
    )
    expert = models.ForeignKey(
        'passport.ExpertProfile',
        on_delete=models.CASCADE,
        related_name='match_results',
    )
    total_score = models.FloatField(help_text="Overall match score 0-100")
    semantic_score = models.FloatField(default=0, help_text="Semantic similarity component")
    field_overlap_score = models.FloatField(default=0, help_text="Field overlap component")
    verified_bonus = models.FloatField(default=0, help_text="Verified credentials bonus")
    explanation = models.TextField(blank=True, help_text="Human-readable explanation")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'match_results'
        ordering = ['-total_score']
        unique_together = ['request', 'expert']

    def __str__(self):
        return f"Match: {self.expert} → {self.request} ({self.total_score})"


class SearchLog(models.Model):
    """Log of search queries for analytics."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='search_logs',
    )
    query = models.TextField()
    filters = models.JSONField(default=dict, blank=True)
    results_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'search_logs'
        ordering = ['-created_at']
