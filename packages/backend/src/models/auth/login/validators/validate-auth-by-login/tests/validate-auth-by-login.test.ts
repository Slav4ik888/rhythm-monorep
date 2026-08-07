import { MOCK_AUTH_BY_LOGIN } from '../../../mocks';
import { validateAuthByLogin } from '..';
import { AuthByLogin } from '../../../types';
import { Context } from 'koa';
import { CtxClass } from '../../../../../../libs/tests';



describe('SCHEMA_NAME.AUTH_BY_LOGIN', () => {
  it('Valid data', () => {
    const mockFn = jest.fn();
    const ctx = new CtxClass(mockFn) as unknown as Context;

    validateAuthByLogin(ctx, MOCK_AUTH_BY_LOGIN);
    expect(mockFn).toBeCalledTimes(0);
    expect(ctx.status).toBe(200);
  });

  it('Email is undefined, Password is number', () => {
    const mockFn = jest.fn();
    const ctx = new CtxClass(mockFn) as unknown as Context;

    validateAuthByLogin(ctx, {
      email    : undefined as unknown as string,
      password : 1640995200000 as unknown as string
    });

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toBe(400);
  });


  it('Email is invalid, Password is 123', () => {
    const mockFn = jest.fn();
    const ctx = new CtxClass(mockFn) as unknown as Context;

    validateAuthByLogin(ctx, {
      email    : 'invalid@mail',
      password : '123',
      addy     : 'addy text'
    } as AuthByLogin);

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toBe(400);
  });

  it('Email is empty, Password is apsent', () => {
    const mockFn = jest.fn();
    const ctx = new CtxClass(mockFn) as unknown as Context;
    
    validateAuthByLogin(ctx, {
      email : ''
    } as AuthByLogin);

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toBe(400);
  });
});

// npm run test:unit validate-auth-by-login.test.ts
