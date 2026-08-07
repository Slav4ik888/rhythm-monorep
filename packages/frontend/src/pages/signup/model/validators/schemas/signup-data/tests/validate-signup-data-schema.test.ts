import { getMockStrLength } from 'shared/helpers/strings';
import { validate, SCHEMA_NAME } from 'shared/lib/validators';
import { MOCK_SIGNUP_DATA_FULL, MOCK_SIGNUP_DATA_SMALL } from '../../../../mocks';


describe('SCHEMA_NAME.SIGNUP_DATA', () => {
  // REQUIRED DATA
  it('Valid with required data', () => {
    expect(validate(SCHEMA_NAME.SIGNUP_DATA, MOCK_SIGNUP_DATA_SMALL).valid).toEqual(true);
  });

  it('Invalid with required data', () => {
    const res = validate(SCHEMA_NAME.SIGNUP_DATA, {
      firstName       : '',
      email           : '',
      password        : '',
      confirmPassword : 'asd',

      partnerId       : getMockStrLength(29),
      permissions     : false,
      isMobile        : undefined
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email           : 'Не верный формат данных, для поля "email".',
      firstName       : 'Поле "Имя" не должно быть пустым.',
      isMobile        : 'Отсутствует обязательное поле "isMobile".',
      password        : 'Поле "Пароль" не должно быть меньше 6 символов.',
      confirmPassword : 'Значение в поле "Повторите пароль", не совпадает с введёным паролем',
      permissions     : 'Для регистрации, необходимо предоставить согласие на обработку персональных данных',
      partnerId       : 'Поле "partnerId" не должно быть больше 28 символов.',
    });
  });


  // FULL DATA
  it('Valid with required data', () => {
    expect(validate(SCHEMA_NAME.SIGNUP_DATA, MOCK_SIGNUP_DATA_FULL).valid).toEqual(true);
  });

  it('Valid with full data', () => {
    const res = validate(SCHEMA_NAME.SIGNUP_DATA, {
      companyName     : 'Bobby Mayers',

      firstName       : 'Имя',
      secondName      : 'Фамилия',
      middleName      : 'Отчество',

      phoneNumber     : '+v9501197888',

      email           : '@',
      password        : getMockStrLength(51),
      confirmPassword : '123',
      partnerId       : getMockStrLength(29),
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email           : 'Не верный формат данных, для поля "email".',
      isMobile        : 'Отсутствует обязательное поле "isMobile".',
      password        : 'Поле "Пароль" не должно быть больше 50 символов.',
      permissions     : 'Отсутствует обязательное поле "permissions".',
      confirmPassword : 'Значение в поле "Повторите пароль", не совпадает с введёным паролем',
      partnerId       : 'Поле "partnerId" не должно быть больше 28 символов.',
    });
  });
});

// npm run test:unit validate-signup-data-schema.test.ts
