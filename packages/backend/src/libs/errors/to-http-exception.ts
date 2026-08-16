// packages/backend/src/libs/errors/to-http-exception.ts
// Единая конвертация ошибок бизнес-логики в NestJS HttpException.
// Раньше каждый контроллер дублировал этот блок catch (err.statusCode → HttpException).

import { HttpException, HttpStatus } from '@nestjs/common';
import { isApiError } from './is-api-error';

/**
 * Преобразует произвольную ошибку в HttpException единого формата:
 * - ошибка модели (Error + statusCode + body) → статус и тело модели;
 * - всё остальное → 500 с обобщённым сообщением (детали не раскрываем клиенту).
 */
export const toHttpException = (err: unknown): HttpException => {
  if (isApiError(err)) {
    const body: object | string = (err.body as object | string) || err.message;
    return new HttpException(body, err.statusCode);
  }

  const message = err instanceof Error ? err.message : String(err);
  return new HttpException({ general: message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
};
