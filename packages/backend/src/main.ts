// packages/backend/src/main.ts
// Точка входа NestJS + Fastify (миграция с Koa)
// Заменяет src/index.ts (Koa)

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { cfg } from './app/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // CORS (из бывшего middleware/cors)
  app.enableCors({
    origin: cfg.SITE_URL,
    credentials: true,
  });

  const port = process.env.PORT || 7575;
  await app.listen(port, '0.0.0.0');
  console.log(`[NestJS] Listening on port ${port}`);
}

bootstrap();
