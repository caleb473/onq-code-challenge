# Enrichment API

A mock third-party property enrichment service. **You should not need to
modify this service** — treat it like an external vendor API you're
integrating against.

Runs on `http://enrichment-api:4000` from inside the docker network, or
`http://localhost:4000` from your host machine.

## Authentication

Every request must include an API key header:

```
X-API-Key: dev-secret-key
```

The key is exposed to the `api` container as `ENRICHMENT_API_KEY`.

Requests without a valid key get a `401`.

## `GET /enrich`

Returns a property enrichment record.

### Query parameters

| Param     | Required | Description              |
| --------- | -------- | ------------------------ |
| `address` | yes      | Street address           |
| `zip`     | yes      | 5-digit ZIP code         |

Missing required params return a `400`.

### Response (200)

```json
{
  "estimatedValue": 425000,
  "yearBuilt": 1978,
  "sqft": 2150,
  "lotSizeSqft": 7200,
  "walkScore": 64,
  "schoolRating": 7.4,
  "crimeIndex": 32,
  "lastSalePrice": 312000,
  "lastSaleDate": "2018-05-23",
  "source": "onq-mock-enrichment",
  "fetchedAt": "2026-05-01T18:42:11.123Z"
}
```

The same `address`+`zip` deterministically returns the same numbers, so
behavior is reproducible across reruns.

### Error responses

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| 400    | Missing `address` or `zip` query param   |
| 401    | Missing or invalid `X-API-Key` header    |

## Quick test from the host

```bash
curl -H "X-API-Key: dev-secret-key" \
  "http://localhost:4000/enrich?address=123%20Main%20St&zip=80202"
```
