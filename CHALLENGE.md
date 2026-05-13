# The Challenge

## Context

Property managers using our app want to see additional information about each
property — estimated market value, year built, walk score, school rating, and
similar enrichment data. We don't have that data ourselves; we license it from
a third-party provider.

That third party has been mocked for you as the **enrichment-api** service.
It's already running and reachable at `http://enrichment-api:4000` from the
API container.

> See `enrichment-api/README.md` for the endpoint, auth, and response shape.

## What we'd like you to build

Wire up property enrichment end-to-end so that:

1. The API can fetch enrichment data for a property from the enrichment service
2. The data is persisted in our Postgres database
3. The web app's property detail page can show enrichment data when it exists

The candidate-facing UI today shows an "No enrichment data yet" placeholder
on the detail page — that placeholder should go away once enrichment data
exists for a property.

## What's already done for you

- A `properties` table seeded with 50 properties (`api/src/db/schema.js`)
- `GET /api/properties` and `GET /api/properties/:id` endpoints
- A property list and property detail page
- The mock enrichment API, fully running (don't modify it)

## What you'll need to do

Roughly:

- Decide how to model the enrichment data in the database
- Add the schema change and apply it to the running database (the API
  README walks through the Drizzle workflow)
- Add an API endpoint that triggers enrichment for a property
- Add UI to the detail page so a user can request enrichment and see the
  result

## A note on questions

This prompt is intentionally not fully spec'd. We expect you to ask us
clarifying questions as you go — that's part of what we're evaluating.
There are no trick questions; if something is unclear, just ask.

## Time

Aim for around 30 minutes of work. We don't expect every edge case to be
handled — focus on getting the happy path working end-to-end first.
