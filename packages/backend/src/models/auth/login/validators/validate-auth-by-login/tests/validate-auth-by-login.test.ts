import { MOCK_AUTH_BY_LOGIN } from '../../../mocks';
import { validateAuthByLogin } from '..';
import { AuthByLogin } from '../../../types';

describe('SCHEMA_NAME.AUTH_BY_LOGIN', () => {
  it('Valid data', () => {
    expect(() => validateAuthByLogin(MOCK_AUTH_BY_LOGIN)).not.toThrow();
  });

  it('Email is undefined, Password is number', () => {
    expect(() =>
      validateAuthByLogin({
        email: undefined as unknown as string,
        password: 1640995200000 as unknown as string,
      }),
    ).toThrow();
  });

  it('Email is invalid, Password is 123', () => {
    expect(() =>
      validateAuthByLogin({
        email: 'invalid@mail',
        password: '123',
        addy: 'addy text',
      } as AuthByLogin),
    ).toThrow();
  });

  it('Email is empty, Password is apsent', () => {
    expect(() =>
      validateAuthByLogin({
        email: '',
      } as AuthByLogin),
    ).toThrow();
  });
});

// npm run test:unit validate-auth-by-login.test.ts
