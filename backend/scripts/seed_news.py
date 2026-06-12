import os
import sys
import django

# Add backend root to path
sys.path.append("/app")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from apps.news.models import Category, Article
from django.utils import timezone

# Categories
cats = [
    ("Khoa học & Công nghệ", "khoa-hoc-cong-nghe", 1),
    ("Chính sách KHCN", "chinh-sach-khcn", 2),
    ("Tin tức nền tảng", "tin-tuc-nen-tang", 3),
    ("Câu chuyện chuyên gia", "cau-chuyen-chuyen-gia", 4),
    ("Sở hữu trí tuệ", "so-huu-tri-tue", 5),
]

created_cats = {}
for name, slug, order in cats:
    cat, _ = Category.objects.get_or_create(slug=slug, defaults={"name": name, "order": order})
    created_cats[slug] = cat
    print(f"  ✓ Category: {cat.name}")

# Articles
articles = [
    {
        "title": "STI-Expert v2.0 chính thức ra mắt: Nền tảng hộ chiếu tri thức số đầu tiên tại Việt Nam",
        "slug": "sti-expert-v2-ra-mat",
        "summary": "STI-Expert v2.0 với công nghệ Blockchain DID/VC, AI Matching và Sàn giao dịch Sở hữu Trí tuệ đã chính thức được triển khai, đánh dấu bước ngoặt trong việc số hóa tri thức KHCN Việt Nam.",
        "content": """## STI-Expert v2.0 — Hệ điều hành Thị trường Tri thức KHCN

Nền tảng STI-Expert v2.0 vừa chính thức ra mắt với hàng loạt tính năng đột phá, hướng tới mục tiêu xây dựng hệ sinh thái kết nối chuyên gia khoa học công nghệ hàng đầu Việt Nam.

### Những điểm nổi bật của phiên bản mới

**1. Hộ chiếu Tri thức Số (Digital Knowledge Passport)**
Mỗi chuyên gia sở hữu một "Hộ chiếu Tri thức" với 22 nhóm thông tin được cấu trúc theo chuẩn quốc tế, bao gồm công trình nghiên cứu, bằng sáng chế, giải thưởng và kinh nghiệm làm việc.

**2. Xác thực Blockchain (DID/VC)**
Mọi thông tin trên hộ chiếu đều được xác thực bằng công nghệ Blockchain theo chuẩn W3C DID/VC, đảm bảo tính minh bạch và không thể giả mạo.

**3. AI Matching thông minh**
Hệ thống sử dụng PhoBERT và pgvector để tự động phân tích ngữ nghĩa và khớp nối chuyên gia với doanh nghiệp trong vòng dưới 2 giây.

**4. Sàn giao dịch IP (IP Marketplace)**
Lần đầu tiên tại Việt Nam, các công trình khoa học và bằng sáng chế có thể được token hóa thành IP-NFT và giao dịch trên sàn, mở ra nguồn tài chính mới cho nghiên cứu.

### Lộ trình phát triển

Trong quý 3/2026, STI-Expert sẽ tích hợp thêm:
- Module Tin nhắn thời gian thực (WebSockets)
- Smart Contract On-chain trên VKAC DLT
- Tính năng xuất CV học thuật chuẩn quốc tế

*Liên hệ hợp tác: contact@stiexpert.com*""",
        "cover_image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        "category": created_cats["tin-tuc-nen-tang"],
        "status": "published",
        "featured": True,
        "author_name": "Ban biên tập STI-Expert",
    },
    {
        "title": "Chiến lược phát triển Khoa học Công nghệ Quốc gia đến năm 2030: Cơ hội và thách thức",
        "slug": "chien-luoc-khcn-quoc-gia-2030",
        "summary": "Nghị quyết 52-NQ/TW về tham gia Cách mạng công nghiệp lần thứ tư đặt ra mục tiêu đưa Việt Nam vào nhóm các quốc gia dẫn đầu ASEAN về nghiên cứu và ứng dụng KHCN vào năm 2030.",
        "content": """## Chiến lược KHCN Quốc gia 2030

Theo Nghị quyết 52-NQ/TW, Việt Nam đặt mục tiêu đến năm 2030 trở thành quốc gia có nền công nghiệp hiện đại, đứng trong nhóm dẫn đầu ASEAN về nghiên cứu và phát triển công nghệ.

### Các trọng tâm chính sách

**Đầu tư vào R&D:** Tăng chi đầu tư cho R&D lên ít nhất 2% GDP vào năm 2030, trong đó đầu tư từ doanh nghiệp chiếm 60%.

**Phát triển nhân lực KHCN:** Đào tạo 100.000 kỹ sư, nhà khoa học trình độ cao trong các lĩnh vực ưu tiên (AI, Blockchain, Công nghệ sinh học, Năng lượng sạch).

**Bảo vệ Sở hữu Trí tuệ:** Xây dựng hệ thống bảo hộ IP đồng bộ với quốc tế, tăng số lượng bằng sáng chế đăng ký quốc tế lên gấp 3 lần.

### Vai trò của STI-Expert

Nền tảng STI-Expert đóng góp vào chiến lược quốc gia thông qua việc số hóa và kết nối hơn 200 chuyên gia KHCN, tạo ra hệ sinh thái thương mại hóa tri thức hiệu quả.

*Nguồn: Nghị quyết 52-NQ/TW ngày 27/9/2019 của Bộ Chính trị*""",
        "cover_image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
        "category": created_cats["chinh-sach-khcn"],
        "status": "published",
        "featured": True,
        "author_name": "Nhóm nghiên cứu chính sách",
    },
    {
        "title": "IP-NFT: Tương lai của việc thương mại hóa nghiên cứu khoa học",
        "slug": "ip-nft-thuong-mai-hoa-nghien-cuu",
        "summary": "Mô hình IP-NFT đang cách mạng hóa cách các nhà khoa học bảo vệ và kiếm tiền từ công trình nghiên cứu của mình. Tham khảo từ Molecule Protocol và Mediolano Protocol.",
        "content": """## IP-NFT: Token hóa Tài sản Trí tuệ

IP-NFT (Intellectual Property Non-Fungible Token) là một khái niệm mới kết hợp giữa luật sở hữu trí tuệ truyền thống và công nghệ Blockchain để tạo ra một cách tiếp cận hoàn toàn mới trong việc sở hữu và giao dịch tài sản trí tuệ.

### Molecule Protocol: Tiên phong trong Pharma IP-NFT

Molecule Protocol là nền tảng đi đầu trong việc ứng dụng IP-NFT cho lĩnh vực dược phẩm. Các nhà nghiên cứu có thể mint quyền sở hữu công trình nghiên cứu thành NFT và gọi vốn cộng đồng (crowdfunding) để tiếp tục nghiên cứu.

### Ứng dụng tại STI-Expert

Tại STI-Expert, chuyên gia có thể:
1. **Mint IP-NFT** từ bằng sáng chế hoặc công trình nghiên cứu trong mục "Hộ chiếu Tri thức"
2. **Niêm yết** trên Sàn giao dịch IP với các điều khoản cấp phép linh hoạt
3. **Nhận Royalties** tự động khi có giao dịch cấp phép thành công
4. **Phân mảnh quyền sở hữu** để gọi vốn cộng đồng cho nghiên cứu

### ZKP: Bảo vệ bí mật sáng chế

Sử dụng Zero-Knowledge Proofs, chuyên gia có thể chứng minh quyền sở hữu mà không cần tiết lộ nội dung chi tiết của sáng chế trước khi giao dịch hoàn tất.""",
        "cover_image": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
        "category": created_cats["so-huu-tri-tue"],
        "status": "published",
        "featured": False,
        "author_name": "TS. Nguyễn Minh Tri",
    },
    {
        "title": "Hành trình của chuyên gia: Từ phòng thí nghiệm đến thị trường",
        "slug": "chuyen-gia-tu-phong-thi-nghiem-den-thi-truong",
        "summary": "Câu chuyện thực tế về cách các nhà khoa học Việt Nam đang chuyển đổi kết quả nghiên cứu thành giá trị kinh tế thông qua nền tảng STI-Expert.",
        "content": """## Hành trình thương mại hóa nghiên cứu

Trong nhiều năm, khoảng cách giữa phòng thí nghiệm và thị trường luôn là rào cản lớn nhất đối với các nhà khoa học Việt Nam. Nghiên cứu xong nhưng không biết bán cho ai, không biết định giá thế nào.

### Câu chuyện từ thực tế

PGS.TS Nguyễn Văn An (tên được thay đổi) — chuyên gia về công nghệ sinh học — đã dành 8 năm nghiên cứu một quy trình lên men mới có khả năng giảm 40% chi phí sản xuất axit amin. Kết quả: 3 bài báo ISI, 1 bằng sáng chế — nhưng không có doanh nghiệp nào biết đến.

Sau khi tham gia STI-Expert và mint công trình thành IP-NFT, trong vòng 3 tháng đã có 2 công ty thực phẩm liên hệ xin cấp phép sử dụng công nghệ.

### Bài học rút ra

- **Khả năng hiển thị (Visibility)** là yếu tố quyết định đầu tiên
- **Định giá đúng** dựa trên tiềm năng thị trường, không chỉ chi phí nghiên cứu
- **Cơ chế bảo vệ IP** phải được thiết lập trước khi công khai thông tin

*Liên hệ để chia sẻ câu chuyện của bạn: stories@stiexpert.com*""",
        "cover_image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        "category": created_cats["cau-chuyen-chuyen-gia"],
        "status": "published",
        "featured": False,
        "author_name": "Ban biên tập STI-Expert",
    },
    {
        "title": "AI và KHCN: PhoBERT đang thay đổi cách tìm kiếm tri thức chuyên ngành tại Việt Nam",
        "slug": "phobert-tim-kiem-tri-thuc-chuyen-nganh",
        "summary": "Mô hình ngôn ngữ PhoBERT được fine-tune trên dữ liệu KHCN tiếng Việt đang tạo ra cuộc cách mạng trong tìm kiếm ngữ nghĩa và kết nối chuyên gia.",
        "content": """## PhoBERT trong KHCN Việt Nam

PhoBERT — mô hình ngôn ngữ tiếng Việt lớn đầu tiên được xây dựng theo kiến trúc RoBERTa — đang được ứng dụng ngày càng rộng rãi trong các hệ thống KHCN.

### Semantic Search: Vượt qua giới hạn từ khóa

Tìm kiếm truyền thống dựa trên từ khóa thường thất bại khi người dùng dùng thuật ngữ khác với tác giả. PhoBERT giải quyết vấn đề này bằng cách hiểu **nghĩa** của câu hỏi.

Ví dụ: Tìm kiếm "chuyên gia về vi khuẩn lên men" sẽ tự động kết nối với chuyên gia có từ khóa "công nghệ sinh học, enzyme, fermentation".

### Ứng dụng tại STI-Expert

```
Input: "Tôi cần chuyên gia tư vấn về chuyển đổi số ngân hàng"
     ↓ PhoBERT Embedding (768 chiều)
     ↓ pgvector cosine search
Output: Top-5 chuyên gia phù hợp nhất
        Điểm tương đồng: 0.94, 0.91, 0.88...
```

Hệ thống hoạt động trong vòng dưới 2 giây với độ chính xác vượt trội so với full-text search thông thường.""",
        "cover_image": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
        "category": created_cats["khoa-hoc-cong-nghe"],
        "status": "published",
        "featured": False,
        "author_name": "Nhóm kỹ thuật STI-Expert",
    },
]

for data in articles:
    if not Article.objects.filter(slug=data["slug"]).exists():
        Article.objects.create(**data, published_at=timezone.now())
        print(f"  ✓ Article: {data['title'][:50]}...")
    else:
        print(f"  - Skip: {data['slug']}")

print("\nDone! Articles:", Article.objects.filter(status="published").count())
