import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../../config/env';

export type AuthPayload = JwtPayload & { sub: number; role: string };

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }
  const token = auth.slice('Bearer '.length);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === 'string') {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }

    const schema = z.object({ sub: z.number(), role: z.string() });
    const parsed = schema.safeParse(decoded);
    if (!parsed.success) {
      return res.status(401).json({ error: { message: 'Invalid token payload' } });
    }

    (req as any).user = parsed.data;
    next();
  } catch {
    return res.status(401).json({ error: { message: 'Invalid token' } });
  }
}