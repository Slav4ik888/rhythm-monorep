import { validate, SCHEMA_NAME } from 'shared/lib/validators';



describe('SCHEMA_NAME.SIGNUP_DATA_END', () => {
  it('Valid with required data', () => {
    expect(validate(SCHEMA_NAME.SIGNUP_DATA_END, {
      email     : 'asdasd@adas.asd',
      emailCode : '123456',
    }).valid).toEqual(true);
  });

  it('Invalid with required data', () => {
    const res = validate(SCHEMA_NAME.SIGNUP_DATA_END, {
      email     : '',
      emailCode : '',
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      email     : 'Не верный формат данных, для поля "email".',
      emailCode : 'Поле "emailCode" не должно быть меньше 6 символов.',
    });
  });

  it('Invalid with required data', () => {
    const res = validate(SCHEMA_NAME.SIGNUP_DATA_END, {
      email     : 'asdasd@adas.asd',
      emailCode : '1234567',
    });

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      emailCode : 'Поле "emailCode" не должно быть больше 6 символов.',
    });
  });
});

// npm run test:unit validate-signup-data-end-schema.test.ts
