// packages/frontend/src/entities/dashboard-templates/index.ts

export type { Template, PartialTemplate } from './model/types';
// Redux slice — устарел, заменён на Zustand (оставлен для обратной совместимости на время миграции)
export { actions as actionsDashboardTemplates, reducer as reducerDashboardTemplates } from './model/slice';
export type { DashboardTemplatesEntities, StateSchemaDashboardTemplates } from './model/slice/state-schema';
export { useDashboardTemplates, useCanTemplateToDashboard } from './model/hooks';
export { getInitialState, isThisTemplate } from './model/utils';
export { MAX_COUNT_BUNCH_TEMPLATES, TEMPLATES_MOCK_DATA } from './model/consts';
// Zustand-стор (новая реализация)
export { useDashboardTemplatesStore } from './model/store';
export type { DashboardTemplatesStore } from './model/store';
