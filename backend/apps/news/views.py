from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Article, Category
from .serializers import (
    ArticleCreateSerializer,
    ArticleDetailSerializer,
    ArticleListSerializer,
    CategorySerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_staff


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleListSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        qs = Article.objects.all()
        if self.action in ("list",):
            qs = qs.filter(status="published")
            cat = self.request.query_params.get("category")
            if cat:
                qs = qs.filter(category__slug=cat)
            q = self.request.query_params.get("q")
            if q:
                qs = qs.filter(title__icontains=q)
            featured = self.request.query_params.get("featured")
            if featured:
                qs = qs.filter(featured=True)
        return qs

    def get_serializer_class(self):
        if self.action == "create":
            return ArticleCreateSerializer
        if self.action in ("retrieve",):
            return ArticleDetailSerializer
        return ArticleListSerializer

    def retrieve(self, request, slug=None):
        article = Article.objects.filter(slug=slug, status="published").first()
        if not article:
            # Allow staff to view drafts
            if request.user.is_authenticated and request.user.is_staff:
                article = Article.objects.filter(slug=slug).first()
        if not article:
            return Response({"detail": "Không tìm thấy bài viết"}, status=404)
        # Increment views
        Article.objects.filter(pk=article.pk).update(views=article.views + 1)
        article.refresh_from_db()
        return Response(ArticleDetailSerializer(article).data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user if self.request.user.is_authenticated else None)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = Article.objects.filter(status="published", featured=True)[:5]
        return Response(ArticleListSerializer(qs, many=True).data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.all().order_by("order", "name")
    pagination_class = None  # Danh mục ít, không cần phân trang