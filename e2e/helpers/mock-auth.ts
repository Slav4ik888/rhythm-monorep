import type { Page } from '@playwright/test';

/**
 * Хелперы для мока авторизации в E2E-тестах.
 *
 * Вместо поднятия реального бэкенда и Firebase перехватываем GET /api/user/getAuth
 * (тот самый запрос, который фронтенд делает при старте через getAuth) и отдаём
 * моковые userData/companyData. Формат ответа совпадает с ResGetAuth фронтенда:
 * { userData, companyData }. После этого useUserStore.auth становится true, и
 * защищённые страницы (user-profile, company-profile, dashboard) рендерятся.
 */

/** Роли пользователя — совпадают с enum Role фронтенда. */
type UserRole = 'Super admin' | 'Developer' | 'Owner' | 'Employee';

/** Минимально достаточная структура пользователя для рендера защищённых страниц. */
export interface E2eUser {
  id: string;
  companyId: string;
  email: string;
  person: {
    displayName: string;
    avatarUrl: string;
    phoneNumber: string;
    fio: { secondName: string; firstName: string; middleName: string };
  };
  role: UserRole;
  status: string;
  isEditAccess: boolean;
  settings: { hintsDontShowAgain: string[] };
}

/** Минимально достаточная структура компании для рендера защищённых страниц. */
export interface E2eCompany {
  id: string;
  companyName: string;
  ownerId: string;
  owner: string;
  status: string;
  companyMembers: unknown[];
  googleData: { url: string };
  customSettings: Record<string, unknown>;
  bunchesUpdated: Record<string, number>;
  sheets: Record<string, unknown>;
  dashboardMembers: unknown[];
  dashboardPublicAccess: Record<string, boolean>;
}

/** Компания по умолчанию в тестах (id используется в URL дашборда). */
export const E2E_COMPANY_ID = 'e2e-company-id';

export const createE2eUser = (overrides: Partial<E2eUser> = {}): E2eUser => ({
  id: 'e2e-user-id',
  companyId: E2E_COMPANY_ID,
  email: 'employee@e2e.test',
  person: {
    displayName: 'Иван Иванов',
    avatarUrl: '',
    phoneNumber: '',
    fio: { secondName: 'Иванов', firstName: 'Иван', middleName: 'Иванович' },
  },
  role: 'Employee',
  status: 'ACTIVE',
  isEditAccess: true,
  settings: { hintsDontShowAgain: [] },
  ...overrides,
});

export const createE2eCompany = (overrides: Partial<E2eCompany> = {}): E2eCompany => ({
  id: E2E_COMPANY_ID,
  companyName: 'ООО «Тест»',
  ownerId: 'e2e-owner-id',
  owner: 'owner@e2e.test',
  status: 'ACTIVE',
  companyMembers: [],
  googleData: { url: '' },
  customSettings: {},
  bunchesUpdated: {},
  sheets: {},
  dashboardMembers: [],
  dashboardPublicAccess: {},
  ...overrides,
});

interface MockAuthOptions {
  user?: Partial<E2eUser>;
  company?: Partial<E2eCompany>;
}

/** Подменяет GET /api/user/getAuth моковыми данными авторизации. */
export const mockAuth = async (page: Page, opts: MockAuthOptions = {}): Promise<void> => {
  const userData = createE2eUser(opts.user);
  const companyData = createE2eCompany(opts.company);

  await page.route('**/api/user/getAuth', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ userData, companyData }),
    }),
  );
};
