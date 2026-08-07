import { SignupData } from '../../../types';
import { validateSignupData } from '..';
import { MOCK_SIGNUP_DATA_FULL, MOCK_SIGNUP_DATA_SMALL } from '../../../mocks';
import { getMockStrLength } from '../../../../../../shared/utils/strings';
import { CtxClass } from '../../../../../../libs/tests';
import { Context } from 'koa';



describe('validateSignupData', () => {
  // REQUIRED DATA
  it('Valid with required data', () => {
    const
      mockFn = jest.fn(),
      ctx    = new CtxClass(mockFn) as unknown as Context;

    validateSignupData(ctx, MOCK_SIGNUP_DATA_SMALL);
    expect(mockFn).toBeCalledTimes(0);
    expect(ctx.status).toBe(200);
    expect(ctx.errors).toEqual({});
  });

  it('Invalid with required data', () => {
    const
      mockFn = jest.fn(),
      ctx    = new CtxClass(mockFn) as unknown as Context;

    // @ts-ignore
    validateSignupData(ctx, {
      firstName       : '',
      email           : '',
      password        : '',
      confirmPassword : 'asd',

      permissions     : false,
      isMobile        : undefined as unknown as boolean
    });

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toEqual(400);
    expect(ctx.errors).toEqual({
      firstName       : 'Поле "Имя" не должно быть пустым.',
      email           : 'Не верный формат данных, для поля "email".',
      isMobile        : 'Отсутствует обязательное поле "isMobile".',
      password        : 'Поле "Пароль" не должно быть меньше 6 символов.',
      confirmPassword : 'Значение в поле "Повторите пароль", не совпадает с введёным паролем',
      permissions     : 'Для регистрации, необходимо предоставить согласие на обработку персональных данных',
      partnerId       : 'Отсутствует обязательное поле "partnerId".',
    });
  });


  // FULL DATA
  it('Valid with required data', () => {
    const
      mockFn = jest.fn(),
      ctx    = new CtxClass(mockFn) as unknown as Context;

    validateSignupData(ctx, MOCK_SIGNUP_DATA_FULL);
    expect(mockFn).toBeCalledTimes(0);
    expect(ctx.status).toEqual(200);
    expect(ctx.errors).toEqual({});
  });


  it('Valid with full data', () => {
    const
      mockFn = jest.fn(),
      ctx    = new CtxClass(mockFn) as unknown as Context;

    validateSignupData(ctx, {
      companyName     : 'Bobby Mayers',

      firstName       : 'Имя',
      secondName      : 'Фамилия',
      middleName      : 'Отчество',

      phoneNumber     : '+v9501197888',

      email           : '@',
      password        : getMockStrLength(51),
      confirmPassword : '123'
    } as SignupData);

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toEqual(400);
    expect(ctx.errors).toEqual({
      email           : 'Не верный формат данных, для поля "email".',
      isMobile        : 'Отсутствует обязательное поле "isMobile".',
      password        : 'Поле "Пароль" не должно быть больше 50 символов.',
      confirmPassword : 'Значение в поле "Повторите пароль", не совпадает с введёным паролем',
      permissions     : 'Отсутствует обязательное поле "permissions".',
      partnerId       : 'Отсутствует обязательное поле "partnerId".',
    });
  });
});

// npm run test:unit validate-signup-data.test.ts
