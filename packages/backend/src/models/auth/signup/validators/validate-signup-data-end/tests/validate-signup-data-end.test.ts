import { validateSignupDataEnd } from '..';
import { MOCK_SIGNUP_DATA_END } from '../../../mocks';

describe('validateSignupDataEnd', () => {
  it('Valid with required data', () => {
    expect(() => validateSignupDataEnd(MOCK_SIGNUP_DATA_END)).not.toThrow();
  });

  it('Invalid with required data', () => {
    expect(() =>
      validateSignupDataEnd({
        email: '',
        emailCode: '',
      }),
    ).toThrow();
  });

  it('emailCode > 6 letters', () => {
    expect(() =>
      validateSignupDataEnd({
        email: MOCK_SIGNUP_DATA_END.email,
        emailCode: '1234567',
      }),
    ).toThrow();
  });
});

// npm run test:unit validate-signup-data-end.test.ts
