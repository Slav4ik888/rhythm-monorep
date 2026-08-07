import { MOCK_USER_ID } from '../../../../../user/lib/mocks';
import { validate } from 'shared/lib/validators';
import { SCHEMA_NAME } from 'shared/lib/validators/ajv/schemas/schema-names';
import { MOCK_FIX_DATE } from '../../../../mocks';


describe('SCHEMA_NAME.FIX_DATE', () => {
  test('Valid fix date', () => {
    const res = validate(SCHEMA_NAME.FIX_DATE, MOCK_FIX_DATE);
    expect(res.valid).toEqual(true);
  });

  it('Valid data', () => {
    const res = validate(SCHEMA_NAME.FIX_DATE, MOCK_FIX_DATE, '');
    expect(res.valid).toEqual(true);
  });

  it('Invalid data - UserId', () => {
    const res = validate(SCHEMA_NAME.FIX_DATE, {
      userId : undefined,
      date   : 1640995200000
    }, '');

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({ userId: 'Отсутствует обязательное поле "userId".' });
  });

  it('Invalid data - date', () => {
    const res = validate(SCHEMA_NAME.FIX_DATE, {
      userId : MOCK_USER_ID,
      date   : undefined
    }, '');

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({ date: 'Отсутствует обязательное поле "date".' });
  });

  it('Invalid data - date is string, + additional', () => {
    const res = validate(SCHEMA_NAME.FIX_DATE, {
      userId : MOCK_USER_ID,
      date   : 'undefined',
      addy   : ''
    }, '');

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({
      addy: 'Присутствует недопустимое поле "addy".',
      date: 'Не верный формат данных, для поля "date".'
    });
  });

  it('Invalid data - userId > 28 chars', () => {
    const res = validate(SCHEMA_NAME.FIX_DATE, {
      userId : `${MOCK_USER_ID}_`,
      date   : 1640995200000
    }, '');

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({ userId: 'Поле "userId" не должно быть больше 28 символов.' });
  });
});

// npm run test:unit validate-fix-date-schema.test.ts
