from django.urls import path
from .views import SemanticSearchView, SuggestionView

urlpatterns = [
    path('search/', SemanticSearchView.as_view(), name='semantic-search'),
    path('suggestions/', SuggestionView.as_view(), name='suggestions'),
]
