// packages/backend/src/models/user/utils/tests/filter-user-data.test.ts

import { filterUserData } from '../filter-user-data';

describe('filterUserData', () => {
  it('оставляет только person и settings', () => {
    const data = {
      id: 'u1',
      companyId: 'c1',
      role: 'Super admin',
      status: 'ACTIVE',
      email: 'x@mail.ru',
      person: { displayName: 'Test' },
      settings: { hintsDontShowAgain: ['h1'] },
      partner: { partnerId: '', referrerId: '' },
    };

    const result = filterUserData(data as never);

    expect(result).toEqual({ person: { displayName: 'Test' }, settings: { hintsDontShowAgain: ['h1'] } });
    expect(result).not.toHaveProperty('role');
    expect(result).not.toHaveProperty('status');
    expect(result).not.toHaveProperty('email');
  });
});
