.PHONY: up down build migrate test lint shell logs restart clean

up:
	docker compose up -d --build

down:
	docker compose down

build:
	docker compose build

migrate:
	docker compose exec backend python manage.py migrate

makemigrations:
	docker compose exec backend python manage.py makemigrations

test:
	docker compose exec backend pytest -v

lint:
	docker compose exec backend ruff check .
	docker compose exec backend ruff format --check .

shell:
	docker compose exec backend bash

logs:
	docker compose logs -f

restart:
	docker compose restart

clean:
	docker compose down -v --remove-orphans
	docker system prune -f
