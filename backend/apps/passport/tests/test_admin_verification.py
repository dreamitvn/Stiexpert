from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from apps.passport.models import ExpertProfile


class AdminVerificationApiTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.expert_user = self.User.objects.create_user(
            email="expert.verify@example.com",
            username="expertverify",
            password="TestPass123!",
            role="expert",
        )
        self.profile = ExpertProfile.objects.create(
            user=self.expert_user,
            full_name="Chuyên Gia Cần Duyệt",
            is_public=True,
        )
        self.manager = self.User.objects.create_user(
            email="manager@example.com",
            username="manager",
            password="TestPass123!",
            role="manager",
        )
        self.staff = self.User.objects.create_user(
            email="verify.staff@example.com",
            username="verifystaff",
            password="TestPass123!",
            role="verification_staff",
        )
        self.business = self.User.objects.create_user(
            email="biz@example.com",
            username="biz",
            password="TestPass123!",
            role="business",
        )

    def test_manager_can_approve_professional_badge(self):
        client = APIClient()
        client.force_authenticate(self.manager)

        res = client.post(
            f"/api/v1/passport/experts/{self.profile.id}/approve_professional/",
            {"note": "Đã đối chiếu Google Scholar/ORCID"},
            format="json",
            HTTP_HOST="v2.stiexpert.com",
        )

        self.assertEqual(res.status_code, 200, res.content)
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.professional_verified)
        self.assertEqual(self.profile.professional_verification_status, "approved")
        self.assertEqual(self.profile.professional_verified_by, self.manager)
        self.assertEqual(self.profile.professional_verification_note, "Đã đối chiếu Google Scholar/ORCID")
        self.assertIsNotNone(self.profile.professional_verified_at)

    def test_verification_staff_can_approve_identity_badge(self):
        client = APIClient()
        client.force_authenticate(self.staff)

        res = client.post(
            f"/api/v1/passport/experts/{self.profile.id}/approve_identity/",
            {"note": "Đã đối soát CCCD"},
            format="json",
            HTTP_HOST="v2.stiexpert.com",
        )

        self.assertEqual(res.status_code, 200, res.content)
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.identity_verified)
        self.assertEqual(self.profile.identity_verification_status, "approved")
        self.assertEqual(self.profile.identity_verified_by, self.staff)
        self.assertEqual(self.profile.identity_verification_note, "Đã đối soát CCCD")
        self.assertIsNotNone(self.profile.identity_verified_at)

    def test_non_admin_roles_cannot_approve_badges(self):
        client = APIClient()
        client.force_authenticate(self.business)

        res = client.post(
            f"/api/v1/passport/experts/{self.profile.id}/approve_professional/",
            {},
            format="json",
            HTTP_HOST="v2.stiexpert.com",
        )

        self.assertEqual(res.status_code, 403, res.content)

    def test_public_profile_exposes_badge_statuses(self):
        self.profile.professional_verified = True
        self.profile.professional_verification_status = "approved"
        self.profile.identity_verified = True
        self.profile.identity_verification_status = "approved"
        self.profile.save(update_fields=[
            "professional_verified",
            "professional_verification_status",
            "identity_verified",
            "identity_verification_status",
        ])

        res = APIClient().get(
            f"/api/v1/passport/experts/{self.profile.id}/",
            HTTP_HOST="v2.stiexpert.com",
        )

        self.assertEqual(res.status_code, 200, res.content)
        data = res.json()
        self.assertTrue(data["professional_verified"])
        self.assertEqual(data["professional_verification_status"], "approved")
        self.assertTrue(data["identity_verified"])
        self.assertEqual(data["identity_verification_status"], "approved")
