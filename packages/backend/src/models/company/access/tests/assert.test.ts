// packages/backend/src/models/company/access/tests/assert.test.ts
// Unit-тесты assert-хелперов (кидают 403 при отсутствии прав).

import { assertCanEditCompany, assertCanEditDashboard, assertCanEditTemplates } from '..';
import type { Company } from '../../types/company';
import { Role } from '../../../user/types/roles';
import type { User } from '../../../user/types';

const ownerUser = (overrides: Partial<User> = {}): User =>
  ({ id: 'owner-1', companyId: 'c1', email: 'owner@mail.ru', role: Role.OWNER, ...overrides }) as User;

const company = (overrides: Partial<Company> = {}): Company =>
  ({
    id: 'c1',
    companyName: 'Test',
    ownerId: 'owner-1',
    owner: 'owner@mail.ru',
    dashboardMembers: [],
    dashboardPublicAccess: {},
    ...overrides,
  }) as Company;

describe('access: assert*', () => {
  it('assertCanEditCompany кидает 403 для чужого', () => {
    expect(() =>
      assertCanEditCompany(ownerUser({ role: Role.EMPLOYEE, id: 'x', email: 'x@mail.ru' }), company()),
    ).toThrow('Нет разрешения на данную операцию');
  });

  it('assertCanEditCompany не кидает для владельца', () => {
    expect(() => assertCanEditCompany(ownerUser(), company())).not.toThrow();
  });

  it('assertCanEditDashboard кидает 403 для чужого', () => {
    expect(() =>
      assertCanEditDashboard(ownerUser({ role: Role.EMPLOYEE, id: 'x', email: 'x@mail.ru' }), company()),
    ).toThrow('Нет разрешения на данную операцию');
  });

  it('assertCanEditTemplates кидает 403 для сотрудника', () => {
    expect(() => assertCanEditTemplates(ownerUser({ role: Role.EMPLOYEE }))).toThrow(
      'Нет разрешения на данную операцию',
    );
  });

  it('assertCanEditTemplates разрешает владельцу', () => {
    expect(() => assertCanEditTemplates(ownerUser({ role: Role.OWNER }))).not.toThrow();
  });

  it('assertCanEditTemplates разрешает супер-админу', () => {
    expect(() => assertCanEditTemplates(ownerUser({ role: Role.SUPER }))).not.toThrow();
  });
});
