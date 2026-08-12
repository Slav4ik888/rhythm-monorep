// packages/backend/src/controllers/company/company.module.ts
// NestJS-модуль для company (миграция с Koa)

import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';

@Module({
  controllers: [CompanyController],
})
export class CompanyModule {}
