# Traffic CRM - Core API

NestJS + Fastify + Prisma backend for core domain entities (Contacts, Companies, Leads, Deals).

## Quick Start

```bash
# From repo root
cd apps/core-api

# 1. Start PostgreSQL
docker compose -f ../../infra/docker/docker-compose.yml up -d postgres

# 2. Generate Prisma client
pnpm prisma:generate

# 3. Run migrations
pnpm prisma:migrate

# 4. Start dev server
pnpm dev
```

API will be available at:

- **API**: <http://localhost:3000/api>
- **Swagger Docs**: <http://localhost:3000/docs>

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm typecheck` - Type check without building
- `pnpm lint` - Lint code
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio (DB GUI)

## Environment Variables

See `.env` file. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - API server port (default: 3000)
- `JWT_PUBLIC_KEY` - JWT verification key (for future auth)

## API Examples

### Create a Contact

```bash
curl -X POST http://localhost:3000/api/contacts \
  -H 'Content-Type: application/json' \
  -d '{
    "orgId": "demo-org",
    "name": "Ada Lovelace",
    "email": "ada@math.io",
    "phone": "+1-555-0100"
  }'
```

### List Contacts

```bash
curl "http://localhost:3000/api/contacts?orgId=demo-org"
```

### Get Contact by ID

```bash
curl "http://localhost:3000/api/contacts/{id}?orgId=demo-org"
```

### Update Contact

```bash
curl -X PATCH "http://localhost:3000/api/contacts/{id}?orgId=demo-org" \
  -H 'Content-Type: application/json' \
  -d '{"name": "Ada King"}'
```

### Delete Contact

```bash
curl -X DELETE "http://localhost:3000/api/contacts/{id}?orgId=demo-org"
```

## Database

Prisma schema is in `prisma/schema.prisma`.

### Migrations

```bash
# Create a new migration
pnpm prisma:migrate

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# View/edit data
pnpm prisma:studio
```

## Architecture

```
src/
├── main.ts              # Bootstrap (Fastify, CORS, Swagger)
├── app.module.ts        # Root module
├── prisma/              # Prisma service (global)
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── modules/             # Feature modules
│   └── contacts/
│       ├── contacts.module.ts
│       ├── contacts.controller.ts
│       ├── contacts.service.ts
│       └── dto.ts
└── common/              # Shared utilities (future)
```

## Next Steps

1. **JWT Guard**: Add authentication middleware to validate JWT tokens
2. **More Modules**: Replicate the Contacts pattern for Companies, Leads, Deals
3. **Pagination**: Add pagination to list endpoints
4. **OpenAPI SDK**: Generate typed client from `/docs-json` for frontend
5. **Background Jobs**: Add BullMQ for async tasks (email, scoring, enrichment)

## Troubleshooting

### Port 3000 already in use

Change `PORT` in `.env` or kill the conflicting process:

```bash
lsof -ti:3000 | xargs kill
```

### Cannot connect to database

Ensure PostgreSQL is running:

```bash
docker compose -f ../../infra/docker/docker-compose.yml ps postgres
```

### Prisma client out of sync

Regenerate after schema changes:

```bash
pnpm prisma:generate
```
