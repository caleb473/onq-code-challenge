import express from 'express';
import { faker } from '@faker-js/faker';

const app = express();
const port = Number(process.env.PORT) || 4000;
const apiKey = process.env.API_KEY || 'dev-secret-key';

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/enrich', (req, res) => {
  const providedKey = req.header('X-API-Key');
  if (providedKey !== apiKey) {
    return res.status(401).json({ error: 'invalid or missing X-API-Key header' });
  }

  const { address, zip } = req.query;
  if (!address || !zip) {
    return res.status(400).json({ error: 'address and zip query parameters are required' });
  }

  // Deterministic per address+zip so the same input returns the same output.
  faker.seed(hashSeed(`${address}|${zip}`));

  res.json({
    estimatedValue: faker.number.int({ min: 120_000, max: 1_800_000 }),
    yearBuilt: faker.number.int({ min: 1900, max: 2024 }),
    sqft: faker.number.int({ min: 600, max: 5500 }),
    lotSizeSqft: faker.number.int({ min: 2000, max: 25_000 }),
    walkScore: faker.number.int({ min: 0, max: 100 }),
    schoolRating: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
    crimeIndex: faker.number.int({ min: 1, max: 100 }),
    lastSalePrice: faker.number.int({ min: 80_000, max: 1_500_000 }),
    lastSaleDate: faker.date.past({ years: 15 }).toISOString().slice(0, 10),
    source: 'onq-mock-enrichment',
    fetchedAt: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`[enrichment-api] listening on port ${port}`);
});

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
