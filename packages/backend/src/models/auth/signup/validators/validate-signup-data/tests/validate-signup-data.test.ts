import { SignupData } from '../../../types';
import { validateSignupData } from '..';
import { MOCK_SIGNUP_DATA_FULL, MOCK_SIGNUP_DATA_SMALL } from '../../../mocks';
import { getMockStrLength } from '../../../../../../shared/utils/strings';

describe('validateSignupData', () => {
  // REQUIRED DATA
  it('Valid with required data', () => {
    expect(() => validateSignupData(MOCK_SIGNUP_DATA_SMALL)).not.toThrow();
  });

  it('Invalid with required data', () => {
    expect(() =>
      validateSignupData({
        firstName: '',
        email: '',
        password: '',
        confirmPassword: 'asd',

        permissions: false,
        isMobile: undefined as unknown as boolean,
      } as SignupData),
    ).toThrow();
  });

  // FULL DATA
  it('Valid with full data', () => {
    expect(() => validateSignupData(MOCK_SIGNUP_DATA_FULL)).not.toThrow();
  });

  it('Invalid with full data', () => {
    expect(() =>
      validateSignupData({
        companyName: 'Bobby Mayers',

        firstName: 'Имя',
        secondName: 'Фамилия',
        middleName: 'Отчество',

        phoneNumber: '+v9501197888',

        email: '@',
        password: getMockStrLength(51),
        confirmPassword: '123',
      } as SignupData),
    ).toThrow();
  });
});

// npm run test:unit validate-signup-data.test.ts
