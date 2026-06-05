import type { Request, Response, NextFunction } from 'express';

// Logs every request as a single JSON line on completion: method, path,
// status code, and duration in ms. Set LOG_LEVEL=silent to disable.
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  if (process.env.LOG_LEVEL === 'silent') return next();

  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    console.log(
      JSON.stringify({
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs,
      })
    );
  });
  next();
}
