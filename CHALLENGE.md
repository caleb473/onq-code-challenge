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
plan for wiring up enrichment across the database, the API, and the web app.

A good plan names the trade-offs and the sharp edges — it doesn't paper over
them. We're more interested in your judgment and how you drive the tool than in
a tidy-looking document.

## Questions your plan should answer

- **Data model:** How would you store the enrichment data, and why that shape
  over the alternatives? How would you apply the change to the database? (See
  the Drizzle workflow in the API README.)
- **API:** What's the new endpoint's contract — method, path, request, and
  response? How does it call the third-party service, and how is the result
  persisted?
- **Web:** What changes on the detail page so a user can request enrichment and
  see the result? What does the user see while it's loading, on success, and on
  failure?
- **Robustness:** What happens if a user triggers enrichment twice, or the
  provider is unavailable?

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
