# STI-Expert

Nền tảng tri thức Khoa học và Công nghệ Việt Nam - Vietnamese Science & Technology Intelligence Expert System.

## Kiến trúc hệ thống

```
┌─────────┐     ┌──────────┐     ┌─────────────┐
│  Nginx  │────▶│ Frontend │     │   MinIO     │
│  :80    │     │ Next.js  │     │  (S3 Store) │
└────┬────┘     └──────────┘     └─────────────┘
     │
     ▼
┌─────────────┐     ┌───────┐     ┌────────────┐
│   Backend   │────▶│ Redis │     │  Celery    │
│   Django    │     │       │     │  Workers   │
└──────┬──────┘     └───────┘     └────────────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │
│  + pgvector  │
└──────────────┘
```

- **Backend**: Django REST Framework + Celery (xử lý bất đồng bộ)
- **Frontend**: Next.js 14+ (React Server Components)
- **Database**: PostgreSQL 16 với pgvector (vector search)
- **Cache/Queue**: Redis 7.4
- **Storage**: MinIO (S3-compatible object storage)
- **Reverse Proxy**: Nginx

## Yêu cầu

- Docker >= 24.0
- Docker Compose >= 2.20
- Make (optional, để dùng shortcuts)

## Cài đặt & Chạy

### 1. Clone repository

```bash
git clone <repo-url> sti-expert
cd sti-expert
```

### 2. Cấu hình môi trường

```bash
cp .env.example .env
# Chỉnh sửa .env theo nhu cầu
```

### 3. Khởi chạy hệ thống

```bash
# Dùng Make
make up

# Hoặc trực tiếp
docker compose up -d --build
```

### 4. Chạy migration

```bash
make migrate
```

### 5. Tạo superuser

```bash
make shell
# Trong container:
python manage.py createsuperuser
```

## Truy cập

| Dịch vụ | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost/api/ |
| Admin | http://localhost/admin/ |
| MinIO Console | http://localhost:9001 |

## Lệnh thường dùng

```bash
make up        # Khởi chạy tất cả services
make down      # Dừng tất cả services
make logs      # Xem logs
make test      # Chạy tests
make lint      # Kiểm tra code style
make migrate   # Chạy database migrations
make shell     # Mở shell trong backend container
```

## Phát triển

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## CI/CD

GitHub Actions tự động chạy khi push/PR vào `main` hoặc `develop`:

1. **Lint** - Kiểm tra code style với ruff
2. **Test** - Chạy pytest với PostgreSQL + Redis services
3. **Build** - Build Docker images

## Cấu trúc thư mục

```
sti-expert/
├── backend/          # Django application
│   ├── config/       # Django settings & WSGI
│   ├── apps/         # Django apps
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/         # Next.js application
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   └── nginx.conf
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── Makefile
├── .env.example
└── README.md
```

## License

Proprietary - All rights reserved.
