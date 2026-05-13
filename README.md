# OnQ Code Challenge

A small property-management-style app for evaluating problem-solving and
integration skills during the developer interview.

## Stack

| Service          | Tech                                | Port |
| ---------------- | ----------------------------------- | ---- |
| `web`            | Vite + React 19 + MUI               | 5173 |
| `api`            | Express 5 + Drizzle ORM + Postgres  | 3000 |
| `enrichment-api` | Express 5 (mock 3rd-party w/ faker) | 4000 |
| `postgres`       | Postgres 17                         | 5432 |

Everything runs in Docker Compose.

## Prerequisites

- Docker Desktop (or any Docker engine + docker compose v2)
- That's it. Yarn / Node / Postgres run inside containers.

## Getting started

```bash
# From this directory:
docker compose up --build
```

On first run this will:

1. Build all four service images
2. Start Postgres and wait for it to be healthy
3. Run `drizzle-kit push` to create the schema
4. Seed 50 properties (idempotent — safe to re-run)
5. Start the API, enrichment API, and Vite dev server

When everything's up:

- **Web app:** http://localhost:5173
- **API:** http://localhost:3000/api/properties
- **Enrichment API:** http://localhost:4000/enrich (requires `X-API-Key`)

## Helpful commands

```bash
# Rebuild everything from scratch (wipes the database):
docker compose down -v && docker compose up --build

# Tail logs for one service:
docker compose logs -f api
docker compose logs -f web

# Open a shell in the api container:
docker compose exec api sh

# Open psql:
docker compose exec postgres psql -U dev -d onq_challenge

# Re-run the seed manually:
docker compose exec api yarn db:seed
```

The top-level `package.json` wraps a few of these as `yarn dev`,
`yarn reset`, `yarn psql`, etc. — see the `scripts` block.

## Project layout

```
onq-code-challenge/
├── docker-compose.yml
├── api/                  # Express + Drizzle. See api/README.md
├── enrichment-api/       # Mock third-party. See enrichment-api/README.md
├── web/                  # Vite + React + MUI
├── README.md             # this file
├── CHALLENGE.md          # the actual coding task
└── INTERVIEWER_NOTES.md  # do not share with candidate
```

## The challenge

See [`CHALLENGE.md`](./CHALLENGE.md).
