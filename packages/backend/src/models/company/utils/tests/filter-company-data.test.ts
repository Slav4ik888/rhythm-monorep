// packages/backend/src/models/company/utils/tests/filter-company-data.test.ts

import { filterCompanyData } from '../filter-company-data';

describe('filterCompanyData', () => {
  it('оставляет только разрешённые поля и убирает ownerId/owner/status', () => {
    const data = {
      id: 'c1',
      companyName: 'New',
      ownerId: 'hacker',
      owner: 'hacker@mail.ru',
      status: 'ACTIVE',
      dashboardMembers: [{ e: 'e@mail.ru', a: { f: 'e' } }],
    };

    const result = filterCompanyData(data as never);

    expect(result).toEqual({ id: 'c1', companyName: 'New', dashboardMembers: [{ e: 'e@mail.ru', a: { f: 'e' } }] });
    expect(result).not.toHaveProperty('ownerId');
    expect(result).not.toHaveProperty('owner');
    expect(result).not.toHaveProperty('status');
  });

  it('не мутирует исходный объект', () => {
    const data = { id: 'c1', ownerId: 'x' };
    filterCompanyData(data as never);
    expect(data).toEqual({ id: 'c1', ownerId: 'x' });
  });
});
