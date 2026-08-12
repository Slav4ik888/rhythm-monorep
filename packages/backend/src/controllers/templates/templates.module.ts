// packages/backend/src/controllers/templates/templates.module.ts
// NestJS-модуль для templates (миграция с Koa)

import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';

@Module({
  controllers: [TemplatesController],
})
export class TemplatesModule {}
