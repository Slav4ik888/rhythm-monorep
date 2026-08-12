// packages/backend/src/guards/firebase-auth.guard.ts
// NestJS-версия middleware/libs/firebase/auth/fb-auth.ts
// Верифицирует Firebase session cookie и добавляет user в request

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { admin } from '../libs/firebase/config/admin-sdk';
import { loggerAuth } from '../libs/loggers';
import models from '../models';
import { cfg } from '../app/config';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const sessionCookie = this.extractSessionCookie(request);

      if (!sessionCookie) {
        throw new UnauthorizedException('Cookie not authenticated');
      }

      const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true);

      const user = await models.user.serviceFindUserById(decodedIdToken?.uid);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = { ...user };

      loggerAuth.info(`[FBAuth] user=${user.id}`);

      return true;
    } catch (err: any) {
      loggerAuth.error(`[FBAuth] verification error: ${err.message || err}`);

      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new UnauthorizedException('Session verification failed');
    }
  }

  /** Извлекает session cookie из Fastify-запроса */
  // eslint-disable-next-line class-methods-use-this
  private extractSessionCookie(request: any): string | null {
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
