import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../entities/User';

export async function meController(req: Request, res: Response) {
  const payload = (req as any).user as { sub: number } | undefined;
  if (!payload) return res.status(401).json({ error: { message: 'Unauthorized' } });

  if (!AppDataSource.isInitialized) {
    return res.status(503).json({ error: { message: 'Database not initialized' } });
  }

  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { id: payload.sub } });
  if (!user) return res.status(404).json({ error: { message: 'User not found' } });

  res.json({ data: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt } });
}