from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from PIL import Image
from rest_framework.test import APIClient


class ExpertProfileNestedUpdateTests(TestCase):
    def test_me_patch_replaces_nested_sections_and_hide_info(self):
        user = get_user_model().objects.create_user(
            email="nested@example.com",
            username="nested",
            password="TestPass123!",
            role="expert",
        )
        client = APIClient()
        client.force_authenticate(user=user)

        payload = {
            "full_name": "Nguyễn Văn Test",
            "title": "Thạc sĩ",
            "summary": "Giới thiệu ngắn",
            "hide_info": True,
            "fields": [
                {"name": "Blockchain", "level": "Middle", "years": 5},
                {"name": "Quản lý rủi ro", "level": "Junior", "years": 1},
            ],
            "certificates": [{"name": "PMP", "issuing_organization": "PMI"}],
            "associations": [{"name": "Hội Tin học Việt Nam"}],
            "science_activities": [{"description": "Mentor cộng đồng KHCN"}],
            "awards": [{"name": "Giải thưởng A", "org": "Bộ KHCN"}],
            "projects": [{"role": "Chủ nhiệm", "sponsor": "NAFOSTED", "result": "Demo"}],
            "patents": [{"num": "VN-001", "org": "NOIP"}],
            "research_results": [{"title": "Kết quả 1", "result": "Ứng dụng AI"}],
            "papers": [{"title": "Paper 1", "year": "2024"}],
            "education": [{"school_name": "ĐHBK", "degree": "Thạc sĩ"}],
            "experiences": [{"position": "Chuyên gia", "company_name": "STI"}],
        }

        res = client.patch("/api/v1/passport/experts/me/", payload, format="json", HTTP_HOST="v2.stiexpert.com")
        self.assertEqual(res.status_code, 200, res.content)
        data = res.json()
        self.assertTrue(data["hide_info"])
        self.assertEqual(len(data["certificates"]), 1)
        self.assertEqual(data["certificates"][0]["name"], "PMP")
        self.assertEqual(len(data["associations"]), 1)
        self.assertEqual(len(data["research_results"]), 1)
        self.assertEqual(data["fields"][0]["name"], "Blockchain")

        payload["certificates"] = [{"name": "AWS", "issuing_organization": "Amazon"}]
        res = client.patch("/api/v1/passport/experts/me/", payload, format="json", HTTP_HOST="v2.stiexpert.com")
        self.assertEqual(res.status_code, 200, res.content)
        self.assertEqual(len(res.json()["certificates"]), 1)
        self.assertEqual(res.json()["certificates"][0]["name"], "AWS")


class ExpertProfileAvatarUploadTests(TestCase):
    def test_me_patch_accepts_avatar_upload(self):
        user = get_user_model().objects.create_user(
            email="avatar@example.com",
            username="avatar",
            password="TestPass123!",
            role="expert",
        )
        client = APIClient()
        client.force_authenticate(user=user)

        image = Image.new("RGB", (8, 8), color="red")
        buf = BytesIO()
        image.save(buf, format="PNG")
        buf.seek(0)
        avatar = SimpleUploadedFile("avatar.png", buf.read(), content_type="image/png")

        res = client.patch(
            "/api/v1/passport/experts/me/",
            {"full_name": "Avatar User", "avatar": avatar},
            format="multipart",
            HTTP_HOST="v2.stiexpert.com",
        )
        self.assertEqual(res.status_code, 200, res.content)
        self.assertTrue(res.json()["avatar"])
