import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/data-source';
import { env } from '../../config/env';
import { User } from '../../entities/User';

export async function login(email: string, password: string) {
  if (!AppDataSource.isInitialized) {
    throw { status: 503, message: 'Database not initialized' };
  }

  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw { status: 401, message: 'Invalid credentials' };

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: '60m',
  });

  return { token };
}