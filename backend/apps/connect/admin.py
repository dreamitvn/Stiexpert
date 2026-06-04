from django.contrib import admin
from .models import ExpertiseRequest, Connection, Message, Review


@admin.register(ExpertiseRequest)
class ExpertiseRequestAdmin(admin.ModelAdmin):
    list_display = ['title', 'requester', 'urgency', 'status', 'created_at']
    list_filter = ['status', 'urgency', 'collaboration_type']
    search_fields = ['title', 'description']


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ['request', 'expert', 'match_score', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['request__title', 'expert__full_name']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['connection', 'sender', 'message_type', 'is_read', 'created_at']
    list_filter = ['message_type', 'is_read']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['connection', 'reviewer', 'rating', 'created_at']
    list_filter = ['rating']
