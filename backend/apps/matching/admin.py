from django.contrib import admin
from .models import ExpertVector, MatchResult, SearchLog


@admin.register(ExpertVector)
class ExpertVectorAdmin(admin.ModelAdmin):
    list_display = ['expert', 'updated_at']
    search_fields = ['expert__full_name']


@admin.register(MatchResult)
class MatchResultAdmin(admin.ModelAdmin):
    list_display = ['request', 'expert', 'total_score', 'created_at']
    list_filter = ['created_at']
    ordering = ['-total_score']


@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'query', 'results_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['query']
