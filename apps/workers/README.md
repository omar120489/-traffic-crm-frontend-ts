# @apps/workers

Background job workers using BullMQ + Redis for asynchronous processing.

## Queues

- **lead-scoring**: Automatic lead qualification scoring
- **enrichment**: Contact/company data enrichment

## Development

```bash
# Ensure Redis is running
docker compose -f infra/docker/docker-compose.yml up -d redis

# Start workers
pnpm --filter @apps/workers dev
```

## Usage

From the Core API or other services:

```typescript
import { leadScoringQueue, enrichmentQueue } from '@apps/workers';

// Enqueue a lead scoring job
await leadScoringQueue.add('score', { leadId: 'ld-123' });

// Enqueue enrichment
await enrichmentQueue.add('enrich-contact', { 
  type: 'contact', 
  entityId: 'ct-456' 
});
```

## Configuration

Environment variables:

- `REDIS_URL`: Redis connection string (default: `redis://localhost:6379`)

## Production

For production deployment:
1. Run multiple worker instances for horizontal scaling
2. Use Redis Cluster or Sentinel for HA
3. Monitor queue metrics via BullMQ Dashboard or custom metrics
4. Configure retry strategies and failure handling

