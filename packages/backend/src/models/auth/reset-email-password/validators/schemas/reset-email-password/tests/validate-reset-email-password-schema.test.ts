import { SCHEMA_NAME } from '../../../../../../../libs/validators/ajv/schemas/schema-names';
import { validate } from '../../../../../../../libs/validators';


describe('SCHEMA_NAME.REC', () => {
  it('Valid data', () => {
    expect(validate(SCHEMA_NAME.RECOVERY_PASSWORD, { email: 'korzan.va@mail.ru' }).valid).toEqual(true);
  });

  it('Email is empty', () => {
    const res = validate(SCHEMA_NAME.RECOVERY_PASSWORD, { email: '' });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email: 'Не верный формат данных, для поля "email".'
    });
  });

  it('Invalid with full data', () => {
    const res = validate(SCHEMA_NAME.RECOVERY_PASSWORD, { email: '@' });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email: 'Не верный формат данных, для поля "email".'
    });
  });
});

// npm run test:unit validate-reset-email-password-schema.test.ts
