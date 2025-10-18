import { AppDataSource } from '../../config/data-source';
import { Order } from '../../entities/Order';

export type OrdersQuery = {
  from?: Date;
  to?: Date;
  page: number;
  pageSize: number;
  sortBy?: 'orderDate' | 'totalAmount';
  sortDir?: 'ASC' | 'DESC';
  status?: string;
  paymentMethod?: string;
};

export async function listOrders(params: OrdersQuery) {
  if (!AppDataSource.isInitialized) throw { status: 503, message: 'Database not initialized' };

  const repo = AppDataSource.getRepository(Order);
  const qb = repo.createQueryBuilder('order').leftJoinAndSelect('order.customer', 'customer');

  if (params.from) qb.andWhere('order.orderDate >= :from', { from: params.from });
  if (params.to) qb.andWhere('order.orderDate <= :to', { to: params.to });
  if (params.status) qb.andWhere('order.status = :status', { status: params.status });
  if (params.paymentMethod) qb.andWhere('order.paymentMethod = :pm', { pm: params.paymentMethod });

  const sortBy = params.sortBy || 'orderDate';
  const sortDir = params.sortDir || 'DESC';
  qb.orderBy(`order.${sortBy}`, sortDir);

  const total = await qb.clone().getCount();

  const page = Math.max(1, params.page);
  const pageSize = Math.min(100, Math.max(1, params.pageSize));

  const data = await qb
    .skip((page - 1) * pageSize)
    .take(pageSize)
    .getMany();

  return { data, meta: { total, page, pageSize } };
}