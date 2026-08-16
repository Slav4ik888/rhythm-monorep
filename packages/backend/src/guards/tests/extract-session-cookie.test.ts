// packages/backend/src/guards/tests/extract-session-cookie.test.ts
// Unit-тесты общего хелпера извлечения session cookie.

import { extractSessionCookie } from '../extract-session-cookie';

describe('extractSessionCookie', () => {
  it('извлекает session-часть из cookies (uid/session)', () => {
    expect(extractSessionCookie({ cookies: { rhythm: 'uid/session456' }, headers: {} })).toBe('session456');
  });

  it('возвращает null, если cookie без session-части', () => {
    expect(extractSessionCookie({ cookies: { rhythm: 'uid' }, headers: {} })).toBeNull();
  });

  it('извлекает session-часть из заголовка cookie', () => {
    expect(extractSessionCookie({ cookies: {}, headers: { cookie: 'rhythm=uid/session789; foo=bar' } })).toBe(
      'session789',
    );
  });

  it('возвращает null при полном отсутствии cookie', () => {
    expect(extractSessionCookie({ cookies: {}, headers: {} })).toBeNull();
  });
});
