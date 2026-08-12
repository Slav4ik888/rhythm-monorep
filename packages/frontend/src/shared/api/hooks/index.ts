// packages/frontend/src/shared/api/hooks/index.ts
// Баррель-экспорт для TanStack Query-хуков

export { useAuthQuery } from './use-auth-query';
export { useGetParamsCompanyQuery, useUpdateCompanyMutation, useDeleteSheetMutation } from './use-company-queries';
export { useGetDashboardDataQuery } from './use-dashboard-data-query';
export {
  useGetBunchesQuery,
  useCreateGroupViewItemsMutation,
  useUpdateViewItemsMutation,
  useDeleteViewItemMutation,
} from './use-dashboard-view-queries';
export type { GetBunchesArgs } from './use-dashboard-view-queries';
