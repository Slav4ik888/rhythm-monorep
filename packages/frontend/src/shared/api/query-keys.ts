// packages/frontend/src/shared/api/query-keys.ts
// Централизованные ключи для TanStack Query
// Позволяют инвалидировать кеш по доменам

export const queryKeys = {
  auth: {
    /** GET /user/getAuth — данные текущего пользователя и компании */
    getAuth: ['auth'] as const,
  },
  company: {
    /** GET /paramsCompany/get — параметры компании */
    params: (companyId: string, dashboardSheetId: string) =>
      ['company', 'params', companyId, dashboardSheetId] as const,
  },
  dashboard: {
    /** GET /dashboard/bunch/get — bunches дашборда */
    bunches: (companyId: string, bunchIds: string[]) => ['dashboard', 'bunches', companyId, ...bunchIds] as const,
    /** GET /getData — данные из Google Sheets */
    data: (companyId: string, dashboardSheetId: string) => ['dashboard', 'data', companyId, dashboardSheetId] as const,
  },
} as const;
