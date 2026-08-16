// packages/backend/src/models/company/access/tests/access.test.ts
// Unit-тесты подсистемы контроля доступа (зеркалит фронтовой use-access).

import {
  ACCESS_PRIORITY,
  canAccess,
  canEditCompany,
  canEditDashboard,
  checkDashboardAccess,
  getUserDashboardAccess,
  isOwner,
  isPrivileged,
} from '..';
import { CompanyDashboardAccessScheme } from '../../types/access';
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

describe('access: ACCESS_PRIORITY', () => {
  it('задаёт приоритеты уровней', () => {
    expect(ACCESS_PRIORITY).toEqual({ n: 0, v: 10, e: 20 });
  });
});

describe('access: isOwner', () => {
  it('true для владельца', () => expect(isOwner(company(), 'owner@mail.ru')).toBe(true));
  it('false для чужого email', () => expect(isOwner(company(), 'other@mail.ru')).toBe(false));
  it('false без email', () => expect(isOwner(company(), undefined)).toBe(false));
  it('false без компании', () => expect(isOwner(undefined, 'owner@mail.ru')).toBe(false));
});

describe('access: isPrivileged', () => {
  it('true для SUPER', () => expect(isPrivileged(ownerUser({ role: Role.SUPER }))).toBe(true));
  it('true для DEV', () => expect(isPrivileged(ownerUser({ role: Role.DEV }))).toBe(true));
  it('false для OWNER', () => expect(isPrivileged(ownerUser({ role: Role.OWNER }))).toBe(false));
  it('false для EMPLOYEE', () => expect(isPrivileged(ownerUser({ role: Role.EMPLOYEE }))).toBe(false));
});

describe('access: getUserDashboardAccess', () => {
  it('находит участника по email', () => {
    const c = company({ dashboardMembers: [{ e: 'emp@mail.ru', a: { f: 'e' } }] });
    expect(getUserDashboardAccess(c, 'emp@mail.ru')).toEqual({ e: 'emp@mail.ru', a: { f: 'e' } });
  });

  it('undefined если участник не найден', () => {
    expect(getUserDashboardAccess(company(), 'x@mail.ru')).toBeUndefined();
  });
});

describe('access: canAccess', () => {
  it('сравнивает приоритеты', () => {
    expect(canAccess('e', 'v')).toBe(true);
    expect(canAccess('v', 'e')).toBe(false);
    expect(canAccess('v', 'v')).toBe(true);
    expect(canAccess(undefined, 'v')).toBe(false);
  });
});

describe('access: canEditCompany', () => {
  it('владелец (ownerId) может', () => expect(canEditCompany(ownerUser(), company())).toBe(true));
  it('владелец (по email) может', () => expect(canEditCompany(ownerUser(), company({ ownerId: 'other' }))).toBe(true));
  it('привилегированная роль может', () =>
    expect(canEditCompany(ownerUser({ role: Role.SUPER, id: 'x' }), company())).toBe(true));
  it('сотрудник не может', () =>
    expect(canEditCompany(ownerUser({ role: Role.EMPLOYEE, id: 'x', email: 'e@mail.ru' }), company())).toBe(false));
  it('без компании → false', () => expect(canEditCompany(ownerUser(), undefined)).toBe(false));
});

describe('access: canEditDashboard', () => {
  it('владелец может', () => expect(canEditDashboard(ownerUser(), company())).toBe(true));

  it('участник с правом e может', () => {
    const c = company({ dashboardMembers: [{ e: 'emp@mail.ru', a: { f: 'e' } }] });
    expect(canEditDashboard(ownerUser({ role: Role.EMPLOYEE, id: 'x', email: 'emp@mail.ru' }), c)).toBe(true);
  });

  it('участник с правом v не может', () => {
    const c = company({ dashboardMembers: [{ e: 'emp@mail.ru', a: { f: 'v' } }] });
    expect(canEditDashboard(ownerUser({ role: Role.EMPLOYEE, id: 'x', email: 'emp@mail.ru' }), c)).toBe(false);
  });

  it('чужой не может', () =>
    expect(canEditDashboard(ownerUser({ role: Role.EMPLOYEE, id: 'x', email: 'x@mail.ru' }), company())).toBe(false));
});

describe('access: checkDashboardAccess', () => {
  it('владелец видит всегда', () =>
    expect(checkDashboardAccess(company(), 'owner@mail.ru', CompanyDashboardAccessScheme.AF, 'v')).toBe(true));

  it('публичная страница доступна для просмотра', () => {
    const c = company({ dashboardPublicAccess: { no_sheetId: true } });
    expect(checkDashboardAccess(c, undefined, CompanyDashboardAccessScheme.AF, 'v')).toBe(true);
  });

  it('публичная страница не даёт редактирование', () => {
    const c = company({ dashboardPublicAccess: { no_sheetId: true } });
    expect(checkDashboardAccess(c, undefined, CompanyDashboardAccessScheme.AF, 'e')).toBe(false);
  });

  it('аноним без публичного доступа → false', () =>
    expect(checkDashboardAccess(company(), undefined, CompanyDashboardAccessScheme.AF, 'v')).toBe(false));

  it('участник с правом v видит', () => {
    const c = company({ dashboardMembers: [{ e: 'emp@mail.ru', a: { f: 'v' } }] });
    expect(checkDashboardAccess(c, 'emp@mail.ru', CompanyDashboardAccessScheme.AF, 'v')).toBe(true);
  });
});
