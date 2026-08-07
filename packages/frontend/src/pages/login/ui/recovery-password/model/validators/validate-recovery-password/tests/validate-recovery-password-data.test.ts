import { validateRecoveryPassword } from '..';



describe('validateRecoveryPassword', () => {
  it('Valid data', () => {
    expect(validateRecoveryPassword('korzan.va@mail.ru').valid).toEqual(true);
  });

  it('Empty', () => {
    const res = validateRecoveryPassword('');

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email: 'Не верный формат данных, для поля "email".'
    });
  });

  it('Valid with full data', () => {
    const res = validateRecoveryPassword({
      companyName: 'Bobby Mayers',
      email: 'korzan.va@mail'
    } as unknown as string);

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email: 'Не верный формат данных, для поля "email".'
    });
  });
});

// npm run test:unit validate-recovery-password-data.test.ts
