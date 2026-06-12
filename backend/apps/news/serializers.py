from rest_framework import serializers
from .models import Article, Category


class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "order", "article_count"]

    def get_article_count(self, obj):
        return obj.articles.filter(status="published").count()


class ArticleListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    author_display = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id", "slug", "title", "summary", "cover_image",
            "category", "category_name", "author_display",
            "status", "featured", "views", "published_at", "created_at",
        ]

    def get_author_display(self, obj):
        if obj.author:
            full_name = f"{obj.author.first_name} {obj.author.last_name}".strip()
            return full_name or obj.author.username
        return obj.author_name or "STI-Expert"


class ArticleDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author_display = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id", "slug", "title", "summary", "content", "cover_image",
            "category", "author_display",
            "status", "featured", "views", "published_at",
            "created_at", "updated_at",
        ]

    def get_author_display(self, obj):
        if obj.author:
            full_name = f"{obj.author.first_name} {obj.author.last_name}".strip()
            return full_name or obj.author.username
        return obj.author_name or "STI-Expert"


class ArticleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            "title", "summary", "content", "cover_image",
            "category", "author_name", "status", "featured",
        ]