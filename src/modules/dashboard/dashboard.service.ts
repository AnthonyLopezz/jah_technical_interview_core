import { AppDataSource } from '../../config/data-source';
import { Order } from '../../entities/Order';
import { OrderItem } from '../../entities/OrderItem';
import { Product } from '../../entities/Product';

export type DateRange = { from?: Date; to?: Date };

function applyDateRange(qb: any, range?: DateRange) {
  if (range?.from) qb.andWhere('`order`.orderDate >= :from', { from: range.from });
  if (range?.to) qb.andWhere('`order`.orderDate <= :to', { to: range.to });
}

export async function getKPIs(range?: DateRange) {
  if (!AppDataSource.isInitialized) throw { status: 503, message: 'Database not initialized' };

  // Total ventas, número de órdenes, ticket promedio
  const base = AppDataSource.getRepository(Order).createQueryBuilder('order');
  applyDateRange(base, range);

  const totals = (await base
    .select('COALESCE(SUM(order.totalAmount), 0)', 'totalSales')
    .addSelect('COUNT(order.id)', 'ordersCount')
    .addSelect('COALESCE(AVG(order.totalAmount), 0)', 'averageTicket')
    .getRawOne<{ totalSales: string; ordersCount: number; averageTicket: string }>()) || { totalSales: '0', ordersCount: 0, averageTicket: '0' };

  // Top 5 productos
  const topProducts = await AppDataSource.getRepository(OrderItem)
    .createQueryBuilder('item')
    .innerJoin('item.order', 'order')
    .innerJoin('item.product', 'product')
    .select('product.id', 'productId')
    .addSelect('product.name', 'name')
    .addSelect('SUM(item.quantity)', 'quantity')
    .addSelect('COALESCE(SUM(item.quantity * item.unitPrice), 0)', 'revenue')
    .where(() => '1=1')
    .andWhere(() => {
      // usar alias `order` para filtros
      return '1=1';
    })
    .groupBy('product.id')
    .orderBy('quantity', 'DESC')
    .limit(5)
    .getRawMany<{ productId: number; name: string; quantity: number; revenue: string }>();

  // Filtros de fecha para topProducts
  const topProductsQB = AppDataSource.getRepository(OrderItem)
    .createQueryBuilder('item')
    .innerJoin('item.order', 'order')
    .innerJoin('item.product', 'product');
  applyDateRange(topProductsQB, range);
  const topProductsFiltered = await topProductsQB
    .select('product.id', 'productId')
    .addSelect('product.name', 'name')
    .addSelect('SUM(item.quantity)', 'quantity')
    .addSelect('COALESCE(SUM(item.quantity * item.unitPrice), 0)', 'revenue')
    .groupBy('product.id')
    .orderBy('quantity', 'DESC')
    .limit(5)
    .getRawMany<{ productId: number; name: string; quantity: number; revenue: string }>();

  // Distribución por método de pago (para gráfica de dona)
  const paymentDistributionQB = AppDataSource.getRepository(Order).createQueryBuilder('order');
  applyDateRange(paymentDistributionQB, range);
  const paymentDistribution = await paymentDistributionQB
    .select('order.paymentMethod', 'paymentMethod')
    .addSelect('COUNT(order.id)', 'orders')
    .addSelect('COALESCE(SUM(order.totalAmount), 0)', 'amount')
    .groupBy('order.paymentMethod')
    .getRawMany<{ paymentMethod: string; orders: number; amount: string }>();

  return {
    totalSales: totals.totalSales,
    ordersCount: Number(totals.ordersCount || 0),
    averageTicket: totals.averageTicket,
    topProducts: topProductsFiltered.length ? topProductsFiltered : topProducts,
    paymentDistribution,
  };
}

export async function getTimeSeries(range: DateRange = {}, granularity: 'day' | 'month' = 'day') {
  if (!AppDataSource.isInitialized) throw { status: 503, message: 'Database not initialized' };

  const qb = AppDataSource.getRepository(Order).createQueryBuilder('order');
  applyDateRange(qb, range);

  const dateExpr = granularity === 'month' ? "DATE_FORMAT(order.orderDate, '%Y-%m')" : 'DATE(order.orderDate)';

  const rows = await qb
    .select(dateExpr, 'period')
    .addSelect('COALESCE(SUM(order.totalAmount), 0)', 'total')
    .groupBy('period')
    .orderBy('period', 'ASC')
    .getRawMany<{ period: string; total: string }>();

  return rows;
}