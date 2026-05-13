import 'dotenv/config';
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[wait-for-db] DATABASE_URL is not set');
  process.exit(1);
}

const maxAttempts = 30;
const delayMs = 1000;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    console.log(`[wait-for-db] connected on attempt ${attempt}`);
    process.exit(0);
  } catch (err) {
    await client.end().catch(() => {});
    console.log(
      `[wait-for-db] attempt ${attempt}/${maxAttempts} failed (${err.code || err.message}), retrying in ${delayMs}ms`,
    );
    if (attempt === maxAttempts) {
      console.error('[wait-for-db] gave up after max attempts');
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
