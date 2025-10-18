import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User';
import { Customer } from '../entities/Customer';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT || 3306,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [User, Customer, Product, Order, OrderItem],
  synchronize: true,
  logging: false,
});

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function initDataSource() {
  if (!env.DB_ENABLED) {
    return null;
  }
  const maxRetries = 10;
  const retryDelayMs = 2000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await AppDataSource.initialize();
      console.log('Base de datos conectada');
      return AppDataSource;
    } catch (err) {
      console.error(`Intento ${attempt}/${maxRetries} - Error al conectar la base de datos:`, err);
      if (attempt < maxRetries) {
        await sleep(retryDelayMs);
      } else {
        console.error('No fue posible conectar a la base de datos después de múltiples intentos.');
        return null;
      }
    }
  }
  return null;
}