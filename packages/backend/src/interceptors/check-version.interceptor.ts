// packages/backend/src/interceptors/check-version.interceptor.ts
// NestJS-версия Koa-middleware middleware/check-version (cv).
// Сверяет версию клиента (заголовок X-Client-Version) с версией на сервере
// и при несовпадении возвращает 409 Conflict — клиент должен обновиться.

import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { FastifyRequest } from 'fastify';
import { cfg } from '../app/config';
import { loggerApp } from '../libs/loggers';

@Injectable()
export class CheckVersionInterceptor implements NestInterceptor {
  // eslint-disable-next-line class-methods-use-this
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    // Fastify хранит заголовки в нижнем регистре
    const clientVersion = request.headers['x-client-version'];
    const serverVersion = cfg.VERSION;

    // Заголовок обязателен у браузерных клиентов (axios шлёт его всегда).
    // Запросы без заголовка (health-check, curl) пропускаем, чтобы их не блокировать.
    if (clientVersion && clientVersion !== serverVersion) {
      loggerApp.error(`[cv] version mismatch: client=${clientVersion} server=${serverVersion}`);

      throw new HttpException(
        {
          error: 'Version mismatch',
          clientVersion,
          serverVersion,
          updateRequired: true,
        },
        HttpStatus.CONFLICT,
      );
    }

    return next.handle();
  }
}
