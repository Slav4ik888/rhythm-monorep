// packages/backend/src/guards/firebase-auth.guard.ts
// NestJS-версия middleware/libs/firebase/auth/fb-auth.ts
// Верифицирует Firebase session cookie и добавляет user в request

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { admin } from '../libs/firebase/config/admin-sdk';
import { loggerAuth } from '../libs/loggers';
import models from '../models';
import type { User } from '../models/user';
import { cfg } from '../app/config';

/** FastifyRequest, в который FirebaseAuthGuard кладёт аутентифицированного пользователя */
interface AuthenticatedRequest extends FastifyRequest {
  cookies?: Record<string, string>;
  user?: User;
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      const sessionCookie = this.extractSessionCookie(request);

      if (!sessionCookie) {
        throw new UnauthorizedException('Cookie not authenticated');
      }

      const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true);

      const user = await models.user.serviceFindUserById(decodedIdToken.uid);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = { ...user };

      loggerAuth.info(`[FBAuth] user=${user.id}`);

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      loggerAuth.error(`[FBAuth] verification error: ${message}`);

      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new UnauthorizedException('Session verification failed');
    }
  }

  /** Извлекает session cookie из Fastify-запроса */
  // eslint-disable-next-line class-methods-use-this
  private extractSessionCookie(request: AuthenticatedRequest): string | null {
    const cookies = request.cookies || {};
    const cookieValue: string = cookies[cfg.COOKIE_NAME] || '';

    if (!cookieValue) {
      const cookieHeader: string = request.headers?.cookie || '';
      const match = cookieHeader.match(new RegExp(`${cfg.COOKIE_NAME}=([^;]+)`));
      if (match) {
        const parts = match[1].split('/');
        return parts[1] || null;
      }
      return null;
    }

    const parts = cookieValue.split('/');
    return parts[1] || null;
  }
}
