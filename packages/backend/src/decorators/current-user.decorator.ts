// packages/backend/src/decorators/current-user.decorator.ts
// NestJS-декоратор для извлечения текущего пользователя из request
// Аналог ctx.state.user в Koa

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Извлекает аутентифицированного пользователя из request (установлен FirebaseAuthGuard) */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
