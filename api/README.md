# API

Express 5 service backed by Postgres via Drizzle ORM.

## Stack

- Node 22 (ES Modules)
- Express 5.1
- Drizzle ORM 0.41 + drizzle-kit 0.31
- `pg` node-postgres driver
- Yarn 4

## Endpoints

| Method | Path                  | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/health`             | Liveness check               |
| GET    | `/api/properties`     | List all properties          |
| GET    | `/api/properties/:id` | Fetch a single property by id |

## Layout

```
src/
├── index.js              # express app entry
├── db/
│   ├── client.js         # exported `db` (drizzle) and `pool` (pg)
│   ├── schema.js         # table definitions — single source of truth
│   └── seed.js           # idempotent seed; bails if data already exists
└── routes/
    └── properties.js     # /api/properties routes
```

When the container starts, `yarn start` runs:

1. `yarn db:push` — applies the current `schema.js` to the database
2. `yarn db:seed` — seeds 50 properties (only on an empty table)
3. `yarn dev` — starts the express server with `node --watch`

## Drizzle workflow

> **You will need to add at least one new column to `schema.js` for the challenge.**
> The schema lives at `src/db/schema.js`. After editing it, sync the database
> with one of the workflows below.

### Quick workflow: `db:push` (recommended for this challenge)

`drizzle-kit push` compares your schema file to the live database and applies
the diff directly. No migration files are written. Fastest for development.

```bash
# from the host:
docker compose exec api yarn db:push

# or, inside the api container:
yarn db:push
```

You'll see drizzle-kit print the SQL it intends to run and ask for confirmation
on destructive changes (drops, type changes). For additive changes (new
nullable column, new table) it applies them straight through.

### Migration workflow: `db:generate` + `db:migrate`

If you want versioned migration files (production-style), use this instead.

```bash
# 1. Generate a migration file from the schema diff:
docker compose exec api yarn db:generate

# This writes a SQL file into ./drizzle/, e.g. drizzle/0001_add_enrichment.sql

# 2. Apply pending migrations:
docker compose exec api yarn db:migrate
```

Generated migration files live in the `drizzle/` folder and should be committed.

### Inspecting the database

```bash
# Open psql:
docker compose exec postgres psql -U dev -d onq_challenge

# Or open Drizzle Studio (web UI on http://localhost:4983):
docker compose exec api yarn db:studio
```

### Re-seeding from scratch

```bash
# Wipes the volume and rebuilds:
docker compose down -v && docker compose up --build
```

## Querying with Drizzle

The app uses the **Drizzle query builder** (not the relational `db.query` API).
Examples from `src/routes/properties.js`:

```js
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { properties } from '../db/schema.js';

// SELECT * FROM properties ORDER BY id
const all = await db.select().from(properties).orderBy(properties.id);

// SELECT * FROM properties WHERE id = $1
const [one] = await db.select().from(properties).where(eq(properties.id, id));

// INSERT
await db.insert(properties).values({ address: '...', city: '...', /* ... */ });

// UPDATE
await db.update(properties).set({ ownerName: 'New Name' }).where(eq(properties.id, id));

// DELETE
await db.delete(properties).where(eq(properties.id, id));
```

For more, see https://orm.drizzle.team/docs/select.

## Environment variables

Set automatically by `docker-compose.yml`. You should not need to touch these.

| Variable             | Purpose                              |
| -------------------- | ------------------------------------ |
| `DATABASE_URL`       | Postgres connection string           |
| `ENRICHMENT_API_URL` | Base URL of the mock enrichment API  |
| `ENRICHMENT_API_KEY` | API key for the enrichment service   |
| `PORT`               | Express listen port (default 3000)   |
