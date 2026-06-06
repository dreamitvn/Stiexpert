"""Creates demo data for STI-Expert platform."""
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.authentication.models import User
from apps.passport.models import ExpertProfile, Publication, Credential, Document
from apps.matching.models import ExpertVector
import random


class Command(BaseCommand):
    help = "Create demo data for STI-Expert (experts, publications, credentials, documents)"

    def handle(self, *args, **options):
        self.stdout.write("Creating demo data...")

        # Demo experts
        experts_data = [
            {
                "email": "nguyen.van.a@vnu.edu.vn",
                "full_name": "GS.TS. Nguyễn Văn A",
                "username": "nguyen.van.a",
                "role": "expert",
                "organization": "Trường Đại học Quốc gia Hà Nội",
                "title": "Giáo sư Tiến sĩ, Khoa Công nghệ Thông tin",
                "bio": "Chuyên gia AI và Machine Learning với 25 năm kinh nghiệm. Tác giả của 150+ bài báo khoa học trên các tạp chí quốc tế. Từng làm việc tại MIT và Stanford.",
                "fields": ["Trí tuệ nhân tạo", "Học máy", "Xử lý ngôn ngữ tự nhiên", "Thị giác máy tính"],
                "orcid": "0000-0002-1234-5678",
                "is_verified": True,
            },
            {
                "email": "tran.thi.b@vnu.edu.vn",
                "full_name": "PGS.TS. Trần Thị B",
                "username": "tran.thi.b",
                "role": "expert",
                "organization": "Trường Đại học Bách Khoa Hà Nội",
                "title": "Phó Giáo sư, Khoa Điện tử - Viễn thông",
                "bio": "Chuyên gia IoT và 5G với 20 năm kinh nghiệm nghiên cứu. Trưởng phòng thí nghiệm IoT tại ĐHBK Hà Nội.",
                "fields": ["IoT", "Mạng 5G", "Viễn thông", "Hệ thống nhúng"],
                "orcid": "0000-0003-2345-6789",
                "is_verified": True,
            },
            {
                "email": "le.van.c@hus.edu.vn",
                "full_name": "TS. Lê Văn C",
                "username": "le.van.c",
                "role": "expert",
                "organization": "Trường Đại học Khoa học Tự nhiên",
                "title": "Tiến sĩ, Khoa Hóa học",
                "bio": "Chuyên gia về vật liệu nano và năng lượng xanh. Tham gia 30+ dự án nghiên cứu quốc tế. Tác giả của 80+ bài báo SCI.",
                "fields": ["Vật liệu nano", "Năng lượng xanh", "Hóa học xanh", "Pin mặt trời"],
                "orcid": "0000-0004-3456-7890",
                "is_verified": True,
            },
            {
                "email": "pham.thi.d@vnu.edu.vn",
                "full_name": "TS. Phạm Thị D",
                "username": "pham.thi.d",
                "role": "expert",
                "organization": "Trường Đại học Kinh tế Quốc dân",
                "title": "Tiến sĩ Quản trị Kinh doanh, Giảng viên cao cấp",
                "bio": "Chuyên gia về đổi mới sáng tạo và khởi nghiệp. Cố vấn cho 50+ startup công nghệ tại Việt Nam.",
                "fields": ["Đổi mới sáng tạo", "Khởi nghiệp", "Quản trị", "Marketing số"],
                "is_verified": True,
            },
            {
                "email": "hoang.van.e@hcmut.edu.vn",
                "full_name": "TS. Hoàng Văn E",
                "username": "hoang.van.e",
                "role": "expert",
                "organization": "Trường Đại học Bách Khoa TP.HCM",
                "title": "Tiến sĩ Cơ khí, Trưởng phòng R&D",
                "bio": "Chuyên gia về robotics và tự động hóa. Phát triển 20+ robot công nghiệp phục vụ các nhà máy tại Việt Nam và Đông Nam Á.",
                "fields": ["Robotics", "Tự động hóa", "Cơ khí thông minh", "AI trong sản xuất"],
                "is_verified": True,
            },
        ]

        created_experts = []
        for i, d in enumerate(experts_data):
            if User.objects.filter(email=d["email"]).exists():
                self.stdout.write(f"  ⚠ {d['email']} already exists, skipping")
                user = User.objects.get(email=d["email"])
                created_experts.append(user)
                continue
            user = User.objects.create_user(
                email=d["email"],
                username=d["username"],
                password="Demo1234!",
                role=d["role"],
                is_verified=d["is_verified"],
            )
            created_experts.append(user)

            # Create ExpertProfile
            profile, _ = ExpertProfile.objects.get_or_create(
                user=user,
                defaults={
                    "full_name": d["full_name"],
                    "title": d.get("title", ""),
                    "organization": d.get("organization", ""),
                    "bio": d.get("bio", ""),
                    "orcid": d.get("orcid", ""),
                    "fields": d.get("fields", []),
                }
            )
            self.stdout.write(f"  ✅ Expert: {d['email']}")

        # Demo publications
        publications_data = [
            {"title": "Deep Learning for Vietnamese NLP: A Comprehensive Survey",
             "type": "journal", "year": 2024, "journal": "ACM Computing Surveys",
             "citation": "Nguyen VA, Tran TB, Le VC (2024). Deep Learning for Vietnamese NLP. ACM Computing Surveys."},
            {"title": "IoT-Based Smart Agriculture System for Vietnam",
             "type": "conference", "year": 2024, "journal": "IEEE ICASSP",
             "citation": "Tran TB et al. (2024). IoT-Based Smart Agriculture. IEEE ICASSP."},
            {"title": "Green Hydrogen Production from Solar Energy in Vietnam",
             "type": "journal", "year": 2023, "journal": "Nature Energy",
             "citation": "Le VC et al. (2023). Green Hydrogen from Solar. Nature Energy."},
            {"title": "AI-Driven Startup Ecosystem in Southeast Asia",
             "type": "journal", "year": 2023, "journal": "Journal of Business Research",
             "citation": "Pham TD et al. (2023). AI-Driven Startups SE Asia. JBR."},
            {"title": "Industrial Robot Control Using Reinforcement Learning",
             "type": "journal", "year": 2024, "journal": "IEEE Transactions on Robotics",
             "citation": "Hoang VE et al. (2024). RL for Robot Control. IEEE T-RO."},
            {"title": "Nanomaterials for Water Purification: A Review",
             "type": "journal", "year": 2022, "journal": "Chemical Reviews",
             "citation": "Le VC (2022). Nanomaterials for Water. Chem Reviews."},
        ]

        for d in publications_data:
            if created_experts:
                pub, created = Publication.objects.get_or_create(
                    title=d["title"],
                    defaults={
                        "type": d["type"],
                        "year": d["year"],
                        "journal": d["journal"],
                        "citation": d["citation"],
                        "doi": f"10.1000/sti.{random.randint(1000,9999)}",
                        "user": created_experts[0],
                    }
                )
                if created:
                    self.stdout.write(f"  📄 Pub: {d['title'][:40]}...")

        # Demo credentials
        credentials_data = [
            {"name": "Chứng chỉ Google Cloud Professional ML Engineer", "issuer": "Google", "year": 2024},
            {"name": "AWS Certified Solutions Architect", "issuer": "Amazon", "year": 2023},
            {"name": "Bằng sáng chế: Hệ thống tưới tiêu thông minh", "issuer": "Cục Sở hữu trí tuệ VN", "year": 2023},
            {"name": "Chứng chỉ Cisco CCIE Routing & Switching", "issuer": "Cisco", "year": 2022},
            {"name": "Giải thưởng Nhà khoa học trẻ Việt Nam 2023", "issuer": "VAST", "year": 2023},
        ]

        for d in credentials_data:
            if created_experts:
                cred, created = Credential.objects.get_or_create(
                    name=d["name"],
                    defaults={
                        "issuer": d["issuer"],
                        "issue_date": f"{d['year']}-0{random.randint(1,9)}-15",
                        "user": created_experts[0],
                    }
                )
                if created:
                    self.stdout.write(f"  🏅 Credential: {d['name'][:40]}...")

        # Demo business user
        if not User.objects.filter(email="contact@fpt.com.vn").exists():
            biz = User.objects.create_user(
                email="contact@fpt.com.vn",
                username="fpt_corp",
                password="Demo1234!",
                role="business",
                is_verified=True,
            )
            self.stdout.write(f"  ✅ Business: contact@fpt.com.vn")

        self.stdout.write(self.style.SUCCESS(f"\n✅ Demo data created!"))
        self.stdout.write(f"   Users: {User.objects.count()}")
        self.stdout.write(f"   Profiles: {ExpertProfile.objects.count()}")
        self.stdout.write(f"   Publications: {Publication.objects.count()}")
        self.stdout.write(f"   Credentials: {Credential.objects.count()}")
        self.stdout.write(f"\n   Login: demo@stiexpert.com / Demo1234!")
        self.stdout.write(f"   Expert login: nguyen.van.a@vnu.edu.vn / Demo1234!")