import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { AppDataSource, initDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Customer } from '../entities/Customer';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';

async function seed() {
  await initDataSource();
  if (!AppDataSource.isInitialized) throw new Error('Database not initialized');

  const userRepo = AppDataSource.getRepository(User);
  const existing = await userRepo.findOne({ where: { email: 'admin@example.com' } });
  if (!existing) {
    const admin = userRepo.create({ email: 'admin@example.com', passwordHash: await bcrypt.hash('admin123', 10), role: 'admin' });
    await userRepo.save(admin);
    console.log('Usuario admin creado: admin@example.com / admin123');
  }

  const customerRepo = AppDataSource.getRepository(Customer);
  const [c1, c2, c3] = await customerRepo.save([
    customerRepo.create({ name: 'Empresa Uno', email: 'uno@corp.com' }),
    customerRepo.create({ name: 'Empresa Dos', email: 'dos@corp.com' }),
    customerRepo.create({ name: 'Consumidor', email: null }),
  ]);

  const productRepo = AppDataSource.getRepository(Product);
  const [p1, p2, p3, p4] = await productRepo.save([
    productRepo.create({ name: 'Producto A', sku: 'SKU-A', price: '19.99', category: 'Categoria 1' }),
    productRepo.create({ name: 'Producto B', sku: 'SKU-B', price: '29.99', category: 'Categoria 1' }),
    productRepo.create({ name: 'Producto C', sku: 'SKU-C', price: '9.99', category: 'Categoria 2' }),
    productRepo.create({ name: 'Producto D', sku: 'SKU-D', price: '49.99', category: 'Categoria 3' }),
  ]);

  const orderRepo = AppDataSource.getRepository(Order);
  const itemRepo = AppDataSource.getRepository(OrderItem);

  const ordersData = [
    { customer: c1, paymentMethod: 'card', status: 'paid', totalAmount: '49.98', items: [ { product: p1, quantity: 1, unitPrice: '19.99' }, { product: p2, quantity: 1, unitPrice: '29.99' } ] },
    { customer: c2, paymentMethod: 'cash', status: 'paid', totalAmount: '19.98', items: [ { product: p3, quantity: 2, unitPrice: '9.99' } ] },
    { customer: c3, paymentMethod: 'card', status: 'paid', totalAmount: '99.98', items: [ { product: p4, quantity: 2, unitPrice: '49.99' } ] },
    { customer: c1, paymentMethod: 'transfer', status: 'paid', totalAmount: '29.97', items: [ { product: p3, quantity: 3, unitPrice: '9.99' } ] },
    { customer: c2, paymentMethod: 'card', status: 'paid', totalAmount: '39.98', items: [ { product: p2, quantity: 1, unitPrice: '29.99' }, { product: p3, quantity: 1, unitPrice: '9.99' } ] },
  ];

  for (let i = 0; i < ordersData.length; i++) {
    const data = ordersData[i];
    const order = orderRepo.create({ customer: data.customer, orderDate: new Date(Date.now() - i * 86400000), status: data.status, paymentMethod: data.paymentMethod, totalAmount: data.totalAmount });
    await orderRepo.save(order);
    for (const it of data.items) {
      const item = itemRepo.create({ order, product: it.product, quantity: it.quantity, unitPrice: it.unitPrice });
      await itemRepo.save(item);
    }
  }

  console.log('Seed de desarrollo completado');
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});