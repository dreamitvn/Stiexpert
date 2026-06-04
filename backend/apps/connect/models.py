import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class ExpertiseRequest(models.Model):
    """A business user's request for expert matching."""

    URGENCY_CHOICES = [
        ('low', 'Thấp'),
        ('normal', 'Bình thường'),
        ('high', 'Cao'),
        ('urgent', 'Khẩn cấp'),
    ]
    COLLAB_CHOICES = [
        ('consulting', 'Tư vấn'),
        ('project', 'Dự án'),
        ('license', 'License công nghệ'),
        ('training', 'Đào tạo'),
    ]
    STATUS_CHOICES = [
        ('open', 'Mở'),
        ('matching', 'Đang matching'),
        ('fulfilled', 'Đã đáp ứng'),
        ('closed', 'Đóng'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expertise_requests'
    )
    title = models.CharField(max_length=500)
    description = models.TextField()
    fields = models.JSONField(default=list, blank=True, help_text="Required expertise fields")
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='normal')
    collaboration_type = models.CharField(max_length=50, choices=COLLAB_CHOICES, blank=True)
    region_preference = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'expertise_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.status})"


class Connection(models.Model):
    """Connection between an expertise request and an expert."""

    STATUS_CHOICES = [
        ('proposed', 'Đề xuất'),
        ('accepted', 'Chấp nhận'),
        ('in_discussion', 'Đang trao đổi'),
        ('completed', 'Hoàn thành'),
        ('cancelled', 'Hủy'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(
        ExpertiseRequest, on_delete=models.CASCADE, related_name='connections'
    )
    expert = models.ForeignKey(
        'passport.ExpertProfile', on_delete=models.CASCADE, related_name='connections'
    )
    match_score = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='proposed')
    initial_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'connections'
        ordering = ['-created_at']
        unique_together = ['request', 'expert']

    def __str__(self):
        return f"Connection: {self.expert} ↔ {self.request} ({self.status})"


class Message(models.Model):
    """In-app message within a connection."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    connection = models.ForeignKey(
        Connection, on_delete=models.CASCADE, related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages'
    )
    content = models.TextField()
    message_type = models.CharField(max_length=20, default='text')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender} at {self.created_at}"


class Review(models.Model):
    """Post-collaboration review from business to expert."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    connection = models.OneToOneField(
        Connection, on_delete=models.CASCADE, related_name='review'
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_given'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    response = models.TextField(blank=True, help_text="Expert's response to review")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'

    def __str__(self):
        return f"Review: {self.rating}★ for {self.connection}"
