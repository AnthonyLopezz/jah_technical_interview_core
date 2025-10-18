import { Request, Response } from 'express';
import { z } from 'zod';
import { getKPIs, getTimeSeries } from './dashboard.service';

const RangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export async function kpisController(req: Request, res: Response) {
  const parsed = RangeSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Invalid date range' } });
  }
  const { from, to } = parsed.data;
  try {
    const data = await getKPIs({ from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined });
    res.json({ data });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: { message: err?.message || 'Internal error' } });
  }
}

const TimeSeriesSchema = RangeSchema.extend({
  granularity: z.enum(['day', 'month']).default('day'),
});

export async function timeSeriesController(req: Request, res: Response) {
  const parsed = TimeSeriesSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Invalid query params' } });
  }
  const { from, to, granularity } = parsed.data;
  try {
    const data = await getTimeSeries({ from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined }, granularity);
    res.json({ data });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: { message: err?.message || 'Internal error' } });
  }
}