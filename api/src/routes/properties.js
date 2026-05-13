import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { properties } from '../db/schema.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const rows = await db.select().from(properties).orderBy(properties.id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'invalid id' });
    }
    const [row] = await db.select().from(properties).where(eq(properties.id, id));
    if (!row) {
      return res.status(404).json({ error: 'property not found' });
    }
    res.json(row);
  } catch (err) {
    next(err);
  }
});

export default router;
