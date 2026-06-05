import express from 'express';

const app = express();
app.use(express.json());

// GET /health - liveness probe
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('API listening on :3000');
});

export default app;
