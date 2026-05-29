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

## What we want

We want to add property enrichment end-to-end so that:

1. The API can fetch enrichment data for a property from the enrichment service
2. The data is persisted in our Postgres database
3. The web app's property detail page can show enrichment data when it exists

The detail page today shows a "No enrichment data yet" placeholder — that
placeholder should go away once enrichment data exists for a property.

## Your task: plan it, don't build it

**You are not writing the final implementation.** Instead, use Claude Code to
produce an *implementation plan* — and we'll evaluate how you scope and direct
the work.

Explore the existing code, ask clarifying questions, and drive Claude toward a
plan that covers:

- **Data model** — how you'd model the enrichment data in Postgres, and *why*
  (and how you'd apply the schema change — see the Drizzle workflow in the API
  README)
- **API** — the new endpoint that triggers enrichment for a property: its
  contract (method, path, request/response), how it calls the third party, and
  how the result is persisted
- **Web** — what changes on the detail page so a user can request enrichment
  and see the result

A good plan names the trade-offs and the sharp edges — it doesn't paper over
them. We're more interested in your judgment and how you drive the tool than in
a tidy-looking document.

## What's already done for you

- A `properties` table seeded with 50 properties (`api/src/db/schema.js`)
- `GET /api/properties` and `GET /api/properties/:id` endpoints
- A property list and property detail page
- The mock enrichment API, fully running (don't modify it)

## A note on questions

This prompt is intentionally not fully spec'd. We expect you to ask us
clarifying questions as you go — that's part of what we're evaluating. There
are no trick questions; if something is unclear, just ask.

## Time

Aim for around 10–15 minutes. We don't expect an exhaustive design doc — focus
on a clear, correct plan for the happy path, and flag the edge cases you'd
want to handle rather than solving every one.
