// packages/backend/src/controllers/dashboard/dashboard.module.ts
// NestJS-модуль для dashboard (миграция с Koa)

import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';

@Module({
  controllers: [DashboardController],
})
export class DashboardModule {}
