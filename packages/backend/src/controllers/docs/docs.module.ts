// packages/backend/src/controllers/docs/docs.module.ts
// NestJS-модуль для docs (миграция с Koa)

import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';

@Module({
  controllers: [DocsController],
})
export class DocsModule {}
