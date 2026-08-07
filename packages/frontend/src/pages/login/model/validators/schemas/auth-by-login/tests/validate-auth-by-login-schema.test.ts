import { validate, SCHEMA_NAME } from 'shared/lib/validators';
import { MOCK_AUTH_BY_LOGIN } from '../../../../mocks';


describe('SCHEMA_NAME.AUTH_BY_LOGIN', () => {
  it('Valid data', () => {
    expect(validate(SCHEMA_NAME.AUTH_BY_LOGIN, MOCK_AUTH_BY_LOGIN).valid).toEqual(true);
  });

  it('Email is undefined, Password is number', () => {
    const res = validate(SCHEMA_NAME.AUTH_BY_LOGIN, {
      email    : undefined,
      password : 1640995200000
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email    : 'Отсутствует обязательное поле "email".',
      password : 'Не верный формат данных, для поля "Пароль".'
    });
  });


  it('Email is invalid, Password is 123', () => {
    const res = validate(SCHEMA_NAME.AUTH_BY_LOGIN, {
      email    : 'invalid@mail',
      password : '123',
      addy     : 'addy text'
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      addy     : 'Присутствует недопустимое поле "addy".',
      email    : 'Не верный формат данных, для поля "email".',
      password : 'Поле "Пароль" не должно быть меньше 6 символов.'
    });
  });

  it('Email is empty, Password is apsent', () => {
    const res = validate(SCHEMA_NAME.AUTH_BY_LOGIN, {
      email : ''
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email    : 'Не верный формат данных, для поля "email".',
      password : 'Отсутствует обязательное поле "password".'
    });
  });
});

// npm run test:unit validate-auth-by-login-schema.test.ts
