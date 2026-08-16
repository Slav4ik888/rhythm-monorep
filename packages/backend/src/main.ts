// packages/backend/src/main.ts
// Точка входа NestJS + Fastify (миграция с Koa)
// Заменяет src/index.ts (Koa)

import 'reflect-metadata';
import './config/load-env';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { cfg } from './app/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // CORS (из бывшего middleware/cors)
  app.enableCors({
    origin: cfg.SITE_URL,
    credentials: true,
  });

  // OpenAPI / Swagger — документация API-контрактов (Swagger UI на /api/docs)
  const swaggerConfig = new DocumentBuilder()
    .setTitle(cfg.SITE_TITLE_FULL)
    .setDescription('API информационной панели руководителя «Ритм»')
    .setVersion(cfg.VERSION)
    .addTag('auth', 'Авторизация и регистрация')
    .addTag('user', 'Пользователь и личный кабинет')
    .addTag('company', 'Управление компанией')
    .addTag('dashboard', 'Дашборды')
    .addTag('templates', 'Шаблоны дашбордов')
    .addTag('partner', 'Реферальная программа')
    .addTag('params-company', 'Параметры компании')
    .addTag('docs', 'Документы')
    .addTag('logs', 'Логи (служебные)')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = process.env.PORT || 7575;
  await app.listen(port, '0.0.0.0');
  console.log(`[NestJS] Listening on port ${port}`);
}

bootstrap();
