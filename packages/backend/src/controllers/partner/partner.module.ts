// packages/backend/src/controllers/partner/partner.module.ts
// NestJS-модуль для partner (миграция с Koa)

import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';

@Module({
  controllers: [PartnerController],
})
export class PartnerModule {}
