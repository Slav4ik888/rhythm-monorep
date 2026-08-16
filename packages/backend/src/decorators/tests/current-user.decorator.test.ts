// packages/backend/src/decorators/tests/current-user.decorator.test.ts
// Unit-тест CurrentUser-декоратора: извлечение request.user из контекста.

import 'reflect-metadata';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from '../current-user.decorator';

type ParamFactory = (data: unknown, ctx: { switchToHttp: () => { getRequest: () => unknown } }) => unknown;

// Класс-носитель: применяем @CurrentUser() к параметру метода, чтобы затем
// вытащить фабрику декоратора из metadata (как это делает NestJS).
class TestController {
  // eslint-disable-next-line class-methods-use-this
  test(@CurrentUser() user: unknown): void {
    // метод нужен только как носитель декоратора параметра
  }
}

describe('CurrentUser', () => {
  const getFactory = (): ParamFactory => {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'test') as Record<
      string,
      { factory: ParamFactory }
    >;
    return Object.values(args)[0].factory;
  };

  it('возвращает request.user из контекста запроса', () => {
    const user = { id: 'uid123', email: 'a@b.c' };
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user }) }) };

    expect(getFactory()(undefined, ctx)).toEqual(user);
  });

  it('возвращает undefined, если request.user отсутствует', () => {
    const ctx = { switchToHttp: () => ({ getRequest: () => ({}) }) };

    expect(getFactory()(undefined, ctx)).toBeUndefined();
  });
});
