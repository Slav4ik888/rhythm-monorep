// packages/backend/src/views/errors/tests/err-code.test.ts
// Unit-тесты ERR_CODE: значения базовых и Firebase-кодов ошибок.

import { ERR_CODE } from '../err-code';

describe('ERR_CODE', () => {
  it('содержит базовые коды ошибок', () => {
    expect(ERR_CODE.UnknownUserEmail).toBe('UnknownUserEmail');
    expect(ERR_CODE.EmailExist).toBe('EmailExist');
    expect(ERR_CODE.PasswordWrong).toBe('PasswordWrong');
    expect(ERR_CODE.General).toBe('General');
    expect(ERR_CODE.BadRequest).toBe('Bad Request');
    expect(ERR_CODE.CannotGetData).toBe('CannotGetData');
  });

  it('содержит коды ошибок Firebase Auth', () => {
    expect(ERR_CODE['auth/user-not-found']).toBe('auth/user-not-found');
    expect(ERR_CODE['auth/wrong-password']).toBe('auth/wrong-password');
    expect(ERR_CODE['auth/email-already-in-use']).toBe('auth/email-already-in-use');
    expect(ERR_CODE['auth/id-token-expired']).toBe('auth/id-token-expired');
  });
});
