from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.passport.models import ExpertProfile
from apps.passport.serializers import PublicExpertProfileSerializer


class PublicExpertPrivacyTests(TestCase):
    def test_hide_info_masks_private_identity_and_contact_fields(self):
        user = get_user_model().objects.create_user(
            email="privacy@example.com",
            username="privacy",
            password="TestPass123!",
            role="expert",
        )
        profile = ExpertProfile.objects.create(
            user=user,
            full_name="Nguyễn Văn Riêng",
            email="secret@example.com",
            phone="0900000000",
            dob="1980-01-02",
            gender="male",
            address="Địa chỉ riêng",
            identification_number="001122334455",
            orcid="0000-0001",
            google_scholar="https://scholar.google.com/private",
            researchgate="https://researchgate.net/private",
            facebook="https://facebook.com/private",
            linkedin="https://linkedin.com/in/private",
            website="https://private.example.com",
            hide_info=True,
            is_public=True,
        )

        data = PublicExpertProfileSerializer(profile).data

        for field in [
            "email", "phone", "dob", "gender", "address", "orcid",
            "google_scholar", "researchgate", "facebook", "linkedin", "website",
        ]:
            self.assertIn(field, data)
            self.assertIn(data[field], (None, ""), field)
        self.assertNotIn("identification_number", data)
        self.assertTrue(data["hide_info"])

    def test_public_profile_can_be_retrieved_by_pretty_slug(self):
        user = get_user_model().objects.create_user(
            email="slug@example.com",
            username="sluguser",
            password="TestPass123!",
            role="expert",
        )
        profile = ExpertProfile.objects.create(
            user=user,
            full_name="Đinh Văn Hoàng",
            title="Thạc sĩ",
            is_public=True,
        )
        slug = PublicExpertProfileSerializer(profile).data["slug"]

        res = APIClient().get(f"/api/v1/passport/experts/{slug}/", HTTP_HOST="v2.stiexpert.com")

        self.assertEqual(res.status_code, 200, res.content)
        self.assertEqual(res.json()["id"], str(profile.id))
        self.assertEqual(res.json()["slug"], slug)
        self.assertTrue(slug.startswith("dinh-van-hoang-"))
