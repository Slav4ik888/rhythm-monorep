// packages/backend/src/interceptors/logging.interceptor.ts
// NestJS-версия middleware/logging/index.ts
// Логирует URL-запросы для аналитики

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { FastifyRequest } from 'fastify';
import { loggerUrl } from '../libs/loggers';
import { cfg } from '../app/config';

/** Форма тела запроса, которую читает интерсептор логирования */
interface LoggingBody {
  companyId?: string;
}

/** FastifyRequest + опциональный парсинг cookies (@fastify/cookie может быть не подключён) */
interface LoggingRequest extends FastifyRequest<{ Body: LoggingBody }> {
  cookies?: Record<string, string>;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<LoggingRequest>();
    const userId = this.getUserId(request);
    const companyId = request.body?.companyId || '';

    // Пропускаем логи для служебных пользователей (список — в config INTERNAL_USERS)
    if (!cfg.INTERNAL_USERS.includes(userId)) {
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
  private getUserId(request: LoggingRequest): string {
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
