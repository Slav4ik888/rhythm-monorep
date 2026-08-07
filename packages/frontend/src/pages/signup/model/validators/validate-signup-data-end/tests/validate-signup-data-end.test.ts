import { SignupData } from '../../../types';
import { getMockStrLength } from 'shared/helpers/strings';
import { validateSignupDataEnd } from '..';
import { MOCK_SIGNUP_DATA_FULL, MOCK_SIGNUP_DATA_END } from '../../../mocks';



describe('validateSignupDataEnd', () => {
  it('Valid with required data', () => {
    expect(validateSignupDataEnd(MOCK_SIGNUP_DATA_END).valid).toEqual(true);
  });

  it('Invalid with required data', () => {
    const res = validateSignupDataEnd({
      email           : '',
      emailCode       : '',
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email           : 'Не верный формат данных, для поля "email".',
      emailCode       : 'Поле "emailCode" не должно быть меньше 6 символов.',
    });
  });

  it('emailCode > 6 letters', () => {
    const res = validateSignupDataEnd({
      email           : 'asdasd@asd.er',
      emailCode       : '1234567',
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      emailCode       : 'Поле "emailCode" не должно быть больше 6 символов.',
    });
  });
});

// npm run test:unit validate-signup-data-end.test.ts
