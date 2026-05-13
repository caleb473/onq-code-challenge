# Interviewer notes

> **Internal — do not share with the candidate.** The repo is structured so
> you can hand it over with the README + CHALLENGE.md and nothing else.

## What we're evaluating

| Skill                          | Where it shows up                                   |
| ------------------------------ | --------------------------------------------------- |
| Business analyst / questioning | Their clarifying questions before they start coding |
| Reading docs                   | Picking up Drizzle from `api/README.md`             |
| Reading code                   | Following the existing `properties` route + schema  |
| Async/await + error handling   | Their fetch call to the enrichment API              |
| End-to-end thinking            | Wiring DB → API → UI in one coherent flow           |

## Questions the prompt is designed to provoke

If they don't ask any of these, that's a signal in itself. Reasonable
candidates ask at least 2–3 of them before writing code.

1. **Which fields should we persist?** The enrichment API returns ~10. Do
   we want all of them? Just a subset (estimated value + walk score)?
   - *Acceptable answers:* "Pick the ones that matter for our domain"
     or "all of them, store the raw JSON in a `jsonb` column"
2. **Caching / freshness:** Do we re-fetch every time, or only if missing?
   - *Acceptable answer:* "Fetch once, cache in DB; add a refresh button
     later if you want."
3. **One-to-one or one-to-many?** Should a property have one enrichment
   record (overwrite each time) or a history (insert each time)?
   - *Acceptable answer:* "One-to-one is fine for now — we can add history
     later if there's product demand."
4. **What should fail mode look like?** If the enrichment API errors, do
   we 500 to the client, return a partial response, or queue a retry?
   - *Acceptable answer:* "Surface the error to the UI for now; we can
     add retries later."
5. **UI trigger:** Button on the detail page? Auto-fetch on load? Bulk
   action on the list page?
   - *Acceptable answer:* "Button on detail page is fine for v1."
6. **Schema column type:** Typed columns vs. a single `jsonb`?
   - Either is fine — listen for them weighing tradeoffs (queryability vs.
     flexibility).

## Reference solution outline

A "passing" implementation might look like:

### 1. Schema (`api/src/db/schema.js`)

Add a column to `properties`, or a new table. Either works. Simplest:

```js
import { jsonb, timestamp } from 'drizzle-orm/pg-core';

export const properties = pgTable('properties', {
  // existing columns...
  enrichmentData: jsonb('enrichment_data'),
  enrichedAt: timestamp('enriched_at'),
});
```

Apply via `docker compose exec api yarn db:push`.

### 2. API endpoint

`POST /api/properties/:id/enrich`:

```js
router.post('/:id/enrich', async (req, res, next) => {
  const id = Number(req.params.id);
  const [property] = await db.select().from(properties).where(eq(properties.id, id));
  if (!property) return res.status(404).json({ error: 'not found' });

  const url = new URL('/enrich', process.env.ENRICHMENT_API_URL);
  url.searchParams.set('address', property.address);
  url.searchParams.set('zip', property.zip);

  const response = await fetch(url, {
    headers: { 'X-API-Key': process.env.ENRICHMENT_API_KEY },
  });
  if (!response.ok) {
    return res.status(502).json({ error: 'enrichment failed' });
  }
  const data = await response.json();

  const [updated] = await db
    .update(properties)
    .set({ enrichmentData: data, enrichedAt: new Date() })
    .where(eq(properties.id, id))
    .returning();

  res.json(updated);
});
```

### 3. UI

Add a button on `PropertyDetail.jsx` that POSTs to the enrich endpoint
and re-renders the property with the new data.

## Red flags to watch for

- Doesn't read `api/README.md` and gets stuck on Drizzle for 10+ minutes
- Hard-codes the API key instead of using `process.env`
- Calls the enrichment API directly from the React app (bypasses the
  backend, exposes the API key in the browser)
- No error handling at all on the fetch
- Re-fetches on every page load instead of caching

## Green flags

- Asks 2+ of the prompt-provoked questions before writing code
- Reads the API README before guessing at Drizzle commands
- Uses `process.env.ENRICHMENT_API_URL` / `_KEY` from the existing env vars
- Verbalizes tradeoffs (e.g., "I'll use jsonb so we don't lock in a schema")
- Tests their endpoint with curl or via the UI before declaring done

## Time-saving offers (if they're stuck)

If they're past 20 minutes and haven't gotten unstuck on something:

- Drizzle commands → point them at `api/README.md` Drizzle section
- "How do I trigger this?" → suggest a button on the detail page
- Stuck on env vars in the container → tell them they're already set in
  `docker-compose.yml`; just `process.env.ENRICHMENT_API_URL`
