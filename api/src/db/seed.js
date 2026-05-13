import { faker } from '@faker-js/faker';
import { db, pool } from './client.js';
import { properties } from './schema.js';

const SEED_COUNT = 50;

async function seed() {
  const existing = await db.select({ id: properties.id }).from(properties).limit(1);
  if (existing.length > 0) {
    console.log('[seed] properties table already has data, skipping');
    await pool.end();
    return;
  }

  faker.seed(42);

  const rows = Array.from({ length: SEED_COUNT }, () => ({
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode('#####'),
    beds: faker.number.int({ min: 1, max: 6 }),
    baths: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1),
    sqft: faker.number.int({ min: 600, max: 5500 }),
    ownerName: faker.person.fullName(),
  }));

  await db.insert(properties).values(rows);
  console.log(`[seed] inserted ${rows.length} properties`);
  await pool.end();
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
