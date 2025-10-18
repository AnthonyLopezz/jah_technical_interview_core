import 'reflect-metadata';
import { createApp } from './app';
import { initDataSource } from './config/data-source';
import { env } from './config/env';

async function bootstrap() {
  const app = createApp();
  await initDataSource();

  app.listen(env.PORT, () => {
    console.log(`API escuchando en http://localhost:${env.PORT}`);
  });
}

bootstrap();