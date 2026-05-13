import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import propertiesRouter from './routes/properties.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/properties', propertiesRouter);

app.use((err, req, res, next) => {
  console.error('[api] unhandled error:', err);
  res.status(500).json({ error: 'internal server error' });
});

app.listen(port, () => {
  console.log(`[api] listening on port ${port}`);
});
