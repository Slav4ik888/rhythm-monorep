// packages/backend/src/controllers/params-company/params-company.module.ts
// NestJS-модуль для params-company (миграция с Koa)

import { Module } from '@nestjs/common';
import { ParamsCompanyController } from './params-company.controller';

@Module({
  controllers: [ParamsCompanyController],
})
export class ParamsCompanyModule {}
