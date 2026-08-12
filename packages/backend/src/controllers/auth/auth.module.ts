// packages/backend/src/controllers/auth/auth.module.ts
// NestJS-модуль для auth (миграция с Koa)

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
})
export class AuthModule {}
