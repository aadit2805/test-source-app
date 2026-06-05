import zlib from 'zlib';
import type { Request, Response, NextFunction } from 'express';

const MIN_BYTES = 1024;

// Gzip response compression. Only compresses when the client sends
// `Accept-Encoding: gzip` and the payload is at least MIN_BYTES.
export function compression(req: Request, res: Response, next: NextFunction) {
  const accepts = req.header('accept-encoding') ?? '';
  if (!accepts.includes('gzip')) return next();

  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    const raw = Buffer.from(JSON.stringify(body));
    if (raw.byteLength < MIN_BYTES) return originalJson(body);

    const gzipped = zlib.gzipSync(raw);
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', 'application/json');
    res.end(gzipped);
    return res;
  };
  next();
}
