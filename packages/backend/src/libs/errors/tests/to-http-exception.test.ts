// packages/backend/src/libs/errors/tests/to-http-exception.test.ts
// Unit-тесты toHttpException: конвертация ошибок моделей и прочих ошибок.

import { HttpException, HttpStatus } from '@nestjs/common';
import { toHttpException } from '../to-http-exception';

describe('toHttpException', () => {
  it('возвращает статус и тело ошибки модели (Error + statusCode + body)', () => {
    const err = Object.assign(new Error('ignored message'), {
      statusCode: 400,
      body: { general: 'Неверные данные' },
    });

    const result = toHttpException(err);

    expect(result).toBeInstanceOf(HttpException);
    expect(result.getStatus()).toBe(400);
    expect(result.getResponse()).toEqual({ general: 'Неверные данные' });
  });

  it('использует message, если body отсутствует', () => {
    const err = Object.assign(new Error('message body'), { statusCode: 401 });

    const result = toHttpException(err);

    expect(result.getStatus()).toBe(401);
    expect(result.getResponse()).toBe('message body');
  });

  it('возвращает 500 с обобщённым сообщением для обычной ошибки', () => {
    const result = toHttpException(new Error('unexpected'));

    expect(result.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.getResponse()).toEqual({ general: 'unexpected' });
  });

  it('возвращает 500 для не-Error значений', () => {
    const result = toHttpException('some string');

    expect(result.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.getResponse()).toEqual({ general: 'some string' });
  });
});
