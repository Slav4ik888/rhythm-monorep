// packages/backend/src/interceptors/logging.interceptor.ts
// NestJS-версия middleware/logging/index.ts
// Логирует URL-запросы для аналитики

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { loggerUrl } from '../libs/loggers';
import { cfg } from '../app/config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = this.getUserId(request);
    const companyId = request.body?.companyId || '';

    // Пропускаем логи для служебных пользователей
    const internalUsers = [
      'pT5sk0UDkzgVGXtCRLjk72h4jwV2',
      'wQ51kIvT2xPNVa2uuU0qhcjzqJB3',
      'xcUt9EYBrUbJd3JKiUf05Oxpp5f2',
      '4749Iuxb6ZbOfQsDuPp6ChSIvaI3',
    ];

    if (!internalUsers.includes(userId)) {
      const user = userId || 'quest';
      const ci = companyId ? `[ci]: ${companyId}` : '';
      loggerUrl.info(`[r]: ${request.url} ${ci} [u]: ${user} [ref]: ${request.headers?.referer || ''}`);
    }

    return next.handle().pipe(
      tap({
        error: (err: Error) => {
          loggerUrl.error(`[r]: ${request.url} [error]: ${err.message}`);
        },
      }),
    );
  }

  /** Извлекает userId из куки запроса */
  // eslint-disable-next-line class-methods-use-this
  private getUserId(request: any): string {
    const cookies = request.cookies || {};
    const cookieValue = cookies[cfg.COOKIE_NAME] || '';
    if (!cookieValue) {
      const cookieHeader = request.headers?.cookie || '';
      const match = cookieHeader.match(new RegExp(`${cfg.COOKIE_NAME}=([^;]+)`));
      if (match) return match[1].split('/')[0] || '';
      return '';
    }
    return String(cookieValue).split('/')[0] || '';
  }
}
