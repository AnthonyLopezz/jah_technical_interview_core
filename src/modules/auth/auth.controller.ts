import { Request, Response } from 'express';
import { z } from 'zod';
import { login } from './auth.service';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginController(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Invalid login payload' } });
  }

  const { email, password } = parsed.data;
  try {
    const result = await login(email, password);
    res.json({ data: result });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: { message: err?.message || 'Internal error' } });
  }
}