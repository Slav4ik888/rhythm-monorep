// packages/backend/src/guards/optional-firebase-auth.guard.ts
// Опциональная аутентификация: если session cookie есть — кладём user в request,
// если нет (или cookie невалидна) — пропускаем как анонимного. Guard никогда не кидает 401.

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { admin } from '../libs/firebase/config/admin-sdk';
import models from '../models';
import type { User } from '../models/user';
import { extractSessionCookie } from './extract-session-cookie';

/** FastifyRequest, в который guard кладёт аутентифицированного пользователя */
interface AuthenticatedRequest extends FastifyRequest {
  cookies?: Record<string, string>;
  user?: User;
}

@Injectable()
export class OptionalFirebaseAuthGuard implements CanActivate {
  // eslint-disable-next-line class-methods-use-this
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      const sessionCookie = extractSessionCookie(request);
      if (!sessionCookie) return true;

      const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true);
      const user = await models.user.serviceFindUserById(decodedIdToken.uid);

      if (user) request.user = { ...user };
    } catch {
      // Ошибку аутентификации игнорируем — запрос обрабатывается как анонимный
    }

    return true;
  }
}
