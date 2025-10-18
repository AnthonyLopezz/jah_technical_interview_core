import { Request, Response } from 'express';
import { z } from 'zod';
import { listOrders } from './orders.service';

const QuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['orderDate', 'totalAmount']).optional(),
  sortDir: z.enum(['ASC', 'DESC']).optional(),
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export async function listOrdersController(req: Request, res: Response) {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Invalid query params' } });
  }

  const { from, to, page, pageSize, sortBy, sortDir, status, paymentMethod } = parsed.data;

  try {
    const result = await listOrders({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      page,
      pageSize,
      sortBy,
      sortDir,
      status,
      paymentMethod,
    });

    res.json({ data: result.data, meta: result.meta });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: { message: err?.message || 'Internal error' } });
  }
}