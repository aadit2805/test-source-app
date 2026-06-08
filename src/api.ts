import express from 'express';

const app = express();
app.use(express.json());

// GET /health - liveness probe
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /users - list users, supports pagination via `limit` and `offset` query params
app.get('/users', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;
  const users = Array.from({ length: limit }, (_, i) => ({
    id: offset + i + 1,
    name: `user_${offset + i + 1}`,
  }));
  res.json({ limit, offset, users });
});

// POST /users - create a user; requires `name` in the JSON body
app.post('/users', (req, res) => {
  const { name } = req.body ?? {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required and must be a string' });
  }
  return res.status(201).json({ id: Date.now(), name });
});

app.listen(3000, () => {
  console.log('API listening on :3000');
});

export default app;
