import { SignupData } from '../../../types';
import { getMockStrLength } from 'shared/helpers/strings';
import { validateSignupData } from '..';
import { MOCK_SIGNUP_DATA_FULL, MOCK_SIGNUP_DATA_SMALL } from '../../../mocks';



describe('validateSignupData', () => {
  // REQUIRED DATA
  it('Valid with required data', () => {
    expect(validateSignupData(MOCK_SIGNUP_DATA_SMALL).valid).toEqual(true);
  });

  it('Invalid with required data', () => {
    // @ts-ignore
    const res = validateSignupData({
      firstName       : '',
      email           : '',
      password        : '',
      confirmPassword : 'asd',

      permissions     : false,
      isMobile        : undefined as unknown as boolean
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
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
    expect(validateSignupData(MOCK_SIGNUP_DATA_FULL).valid).toEqual(true);
  });

  it('Valid with full data', () => {
    const res = validateSignupData({
      companyName     : 'Bobby Mayers',

      firstName       : 'Имя',
      secondName      : 'Фамилия',
      middleName      : 'Отчество',

      phoneNumber     : '+v9501197888',

      email           : '@',
      password        : getMockStrLength(51),
      confirmPassword : '123'
    } as SignupData);

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
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
