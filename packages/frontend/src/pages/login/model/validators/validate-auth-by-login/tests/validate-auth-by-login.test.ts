import { MOCK_AUTH_BY_LOGIN } from '../../../mocks';
import { AuthByLogin } from '../../../services';
import { validateAuthByLogin } from '..';


describe('SCHEMA_NAME.AUTH_BY_LOGIN', () => {
  it('Valid data', () => {
    expect(validateAuthByLogin(MOCK_AUTH_BY_LOGIN).valid).toEqual(true);
  });

  it('Email is undefined, Password is number', () => {
    const res = validateAuthByLogin({
      email    : undefined as unknown as string,
      password : 1640995200000 as unknown as string
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email    : 'Отсутствует обязательное поле "email".',
      password : 'Не верный формат данных, для поля "Пароль".'
    });
  });


  it('Email is invalid, Password is 123', () => {
    const res = validateAuthByLogin({
      email    : 'invalid@mail',
      password : '123',
      addy     : 'addy text'
    } as AuthByLogin);

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      addy     : 'Присутствует недопустимое поле "addy".',
      email    : 'Не верный формат данных, для поля "email".',
      password : 'Поле "Пароль" не должно быть меньше 6 символов.'
    });
  });

  it('Email is empty, Password is apsent', () => {
    const res = validateAuthByLogin({
      email : ''
    } as AuthByLogin);

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email    : 'Не верный формат данных, для поля "email".',
      password : 'Отсутствует обязательное поле "password".'
    });
  });
});

// npm run test:unit validate-auth-by-login.test.ts
