// packages/backend/src/controllers/user/user.module.ts
// NestJS-модуль для user (миграция с Koa)

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {}
