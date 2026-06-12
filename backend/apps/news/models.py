import uuid
from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "news_categories"
        verbose_name = "Danh mục"
        verbose_name_plural = "Danh mục"
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Article(models.Model):
    STATUS_CHOICES = [
        ("draft", "Nháp"),
        ("published", "Đã xuất bản"),
        ("archived", "Lưu trữ"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500, verbose_name="Tiêu đề")
    slug = models.SlugField(max_length=500, blank=True, unique=True)
    summary = models.TextField(verbose_name="Tóm tắt", max_length=1000, blank=True)
    content = models.TextField(verbose_name="Nội dung (Markdown/HTML)")
    cover_image = models.URLField(blank=True, verbose_name="Ảnh bìa")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="articles", verbose_name="Danh mục"
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        blank=True, related_name="articles", verbose_name="Tác giả"
    )
    author_name = models.CharField(max_length=200, blank=True, verbose_name="Tên tác giả (khách)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft", verbose_name="Trạng thái")
    featured = models.BooleanField(default=False, verbose_name="Nổi bật")
    views = models.PositiveIntegerField(default=0)
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Ngày xuất bản")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "news_articles"
        verbose_name = "Bài viết"
        verbose_name_plural = "Bài viết"
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:200]
            self.slug = base
        if self.status == "published" and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title