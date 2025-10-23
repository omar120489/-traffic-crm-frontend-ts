# Traffic CRM Infrastructure

Docker Compose stack for local development services.

## Services

- **PostgreSQL** (port 5432): Main database
- **Redis** (port 6379): Job queues and caching
- **MailHog** (ports 1025/8025): Email testing (SMTP + Web UI)
- **MinIO** (ports 9000/9001): S3-compatible object storage

## Usage

```bash
# Start all services
docker compose -f infra/docker/docker-compose.yml up -d

# Start specific services
docker compose -f infra/docker/docker-compose.yml up -d postgres redis

# View logs
docker compose -f infra/docker/docker-compose.yml logs -f

# Stop services
docker compose -f infra/docker/docker-compose.yml down

# Stop and remove volumes (⚠️ deletes data)
docker compose -f infra/docker/docker-compose.yml down -v
```

## Service URLs

- **PostgreSQL**: `postgresql://postgres:postgres@localhost:5432/trafficcrm`
- **Redis**: `redis://localhost:6379`
- **MailHog Web**: http://localhost:8025
- **MinIO Console**: http://localhost:9001 (admin/minioadmin)
- **MinIO API**: http://localhost:9000

## Health Checks

All services include health checks. Monitor with:

```bash
docker compose -f infra/docker/docker-compose.yml ps
```

## Environment Variables

Core API connects via these defaults:
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trafficcrm`
- `REDIS_URL=redis://localhost:6379`
- `SMTP_HOST=localhost:1025`
- `S3_ENDPOINT=http://localhost:9000`

See `apps/core-api/.env.example` for full configuration.

