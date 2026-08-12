// packages/backend/src/controllers/loggers/loggers.module.ts
// NestJS-модуль для loggers (миграция с Koa)

import { Module } from '@nestjs/common';
import { LoggersController } from './loggers.controller';

@Module({
  controllers: [LoggersController],
})
export class LoggersModule {}
