import type { Request, Response, NextFunction } from 'express';

// CORS middleware. Allowed origins are read from the ALLOWED_ORIGINS env
// var (comma-separated); '*' allows any origin. Handles preflight OPTIONS
// requests by short-circuiting with 204.
export function cors(req: Request, res: Response, next: NextFunction) {
  const allowed = (process.env.ALLOWED_ORIGINS ?? '*').split(',').map((o) => o.trim());
  const origin = req.header('origin');

  if (allowed.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
}
