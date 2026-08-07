import { ParamsCompany } from '../../../../../../types';
import { CompanyDashboardAccessScheme } from '../../../types';
import { checkDashboardAccess } from '..'
import { NO_SHEET_ID } from 'entities/dashboard-view';


describe('checkDashboardAccess', () => {
  const mockCompany = {
    owner: 'owner@example.com',
    dashboardPublicAccess: {
      'public-page': true,
      NO_SHEET_ID: false
    },
    dashboardMembers: [
      {
        e: 'admin@example.com',
        a: {
          f: 'e',
          x: { y: 'v' }
        }
      },
      {
        e: 'view.access.user@example.com',
        a: {
          f: 'v',
          y: 'n',
        }
      },
      {
        e: 'none.access.user@example.com',
        a: {
          f: 'n',
          y: 'n',
        }
      }
    ]
  } as unknown as ParamsCompany;

  // 1. Тесты для владельца компании
  describe('when user is owner', () => {
    it('should always return true regardless of access level', () => {
      expect(checkDashboardAccess(
        mockCompany,
        'owner@example.com',
        CompanyDashboardAccessScheme.AF,
        'e',
        'any-page'
      )).toBe(true);

      expect(checkDashboardAccess(
        mockCompany,
        'owner@example.com',
        CompanyDashboardAccessScheme.AF,
        'n',
        'any-page'
      )).toBe(true);
    });
  });

  // 2. Тесты для публичных страниц
  describe('when accessing public page', () => {
    it('should return true for any user on public page', () => {
      expect(checkDashboardAccess(
        mockCompany,
        'none.access.user@example.com',
        CompanyDashboardAccessScheme.AF,
        'v',
        'public-page'
      )).toBe(true);

      expect(checkDashboardAccess(
        mockCompany,
        undefined, // неавторизованный пользователь
        CompanyDashboardAccessScheme.AF,
        'v',
        'public-page'
      )).toBe(true);
    });

    it('should return false for any user on public page for Edit', () => {
      expect(checkDashboardAccess(
        mockCompany,
        'none.access.user@example.com',
        CompanyDashboardAccessScheme.AF,
        'e',
        'public-page'
      )).toBe(false);

      expect(checkDashboardAccess(
        mockCompany,
        undefined, // неавторизованный пользователь
        CompanyDashboardAccessScheme.AF,
        'e',
        'public-page'
      )).toBe(false);
    });

    it('should return false if page is not public', () => {
      expect(checkDashboardAccess(
        mockCompany,
        'none.access.user@example.com',
        CompanyDashboardAccessScheme.AF,
        'v',
        'private-page'
      )).toBe(false);
    });
  });

  // 3. Тесты для разных уровней доступа
  describe('when checking access levels', () => {
    it('should allow edit access for admin', () => {
      expect(checkDashboardAccess(
        mockCompany,
        'admin@example.com',
        CompanyDashboardAccessScheme.AF,
        'e',
        NO_SHEET_ID
      )).toBe(true);
    });

    it('should allow view access for view user', () => {
      expect(checkDashboardAccess(
        mockCompany,
        'view.access.user@example.com',
        CompanyDashboardAccessScheme.AF,
        'v',
        NO_SHEET_ID
      )).toBe(true);

      expect(checkDashboardAccess(
        mockCompany,
        'view.access.user@example.com',
        CompanyDashboardAccessScheme.AF,
        'e',
        NO_SHEET_ID
      )).toBe(false);
    });

    it('should deny access for none user', () => {
      expect(checkDashboardAccess(
        mockCompany,
        'none.access.user@example.com',
        CompanyDashboardAccessScheme.AF,
        'v',
        NO_SHEET_ID
      )).toBe(false);
    });
  });

  // 4. Тесты для несуществующих пользователей
  describe('when user has no access record', () => {
    it('should return false for unknown user', () => {
      expect(checkDashboardAccess(
        mockCompany,
        'unknown@example.com',
        CompanyDashboardAccessScheme.AF,
        'v',
        NO_SHEET_ID
      )).toBe(false);
    });

    it('should return false for undefined user', () => {
      expect(checkDashboardAccess(
        mockCompany,
        undefined,
        CompanyDashboardAccessScheme.AF,
        'v',
        NO_SHEET_ID
      )).toBe(false);
    });
  });

  // 5. Тесты для разных схем доступа
  describe('when using different access schemes', () => {
    it('should check correct access path for scheme', () => {
      // Проверяем доступ по схеме a.x.y для пользователя admin
      expect(checkDashboardAccess(
        mockCompany,
        'admin@example.com',
        'a.x.y' as CompanyDashboardAccessScheme,
        'v',
        NO_SHEET_ID
      )).toBe(true);

      // Для пользователя view.access.user схема a.y должна возвращать 'n'
      expect(checkDashboardAccess(
        mockCompany,
        'view.access.user@example.com',
        'a.y' as CompanyDashboardAccessScheme,
        'v',
        NO_SHEET_ID
      )).toBe(false);
    });
  });

  // 6. Граничные случаи
  describe('edge cases', () => {
    it('should handle empty company object', () => {
      expect(checkDashboardAccess(
        {} as ParamsCompany,
        'admin@example.com',
        CompanyDashboardAccessScheme.AF,
        'v',
        NO_SHEET_ID
      )).toBe(false);
    });

    it('should handle undefined dashboardMembers', () => {
      const companyWithoutMembers = { ...mockCompany, dashboardMembers: undefined };
      expect(checkDashboardAccess(
        // @ts-ignore
        companyWithoutMembers,
        'admin@example.com',
        CompanyDashboardAccessScheme.AF,
        'v',
        NO_SHEET_ID
      )).toBe(false);
    });
  });
});

// npm run test:unit check-dashboard-access.test.ts
