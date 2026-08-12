import { validateResetEmailPassword } from '..';

describe('validateResetEmailPassword', () => {
  it('Valid data', () => {
    expect(() => validateResetEmailPassword('korzan.va@mail.ru')).not.toThrow();
  });

  it('Empty', () => {
    expect(() => validateResetEmailPassword('')).toThrow();
  });

  it('Invalid email', () => {
    expect(() => validateResetEmailPassword('korzan.va@mail')).toThrow();
  });
});

// npm run test:unit validate-reset-email-password-data.test.ts
