import express from 'express';

const app = express();
app.use(express.json());

// API key auth: every request must send the `x-api-key` header.
// The key is read from the API_KEY env var. Requests without a
// matching key are rejected with 401.
app.use((req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'invalid or missing API key' });
  }
  next();
});

// GET /health - liveness probe
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /me - returns the authenticated caller's identity
app.get('/me', (_req, res) => {
  res.json({ authenticated: true });
});

app.listen(3000, () => {
  console.log('API listening on :3000');
});

export default app;
