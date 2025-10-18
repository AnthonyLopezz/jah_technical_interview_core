import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const headerId = req.headers['x-request-id'];
  const id = typeof headerId === 'string' ? headerId : Array.isArray(headerId) ? headerId[0] : randomUUID();
  res.setHeader('X-Request-Id', id);
  (req as any).id = id;
  next();
}