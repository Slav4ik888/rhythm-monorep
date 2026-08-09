// packages/frontend/src/entities/dashboard-templates/index.ts

export type { Template, PartialTemplate } from './model/types';
export type { DashboardTemplatesEntities, StateSchemaDashboardTemplates } from './model/state-schema';
export { useDashboardTemplates, useCanTemplateToDashboard } from './model/hooks';
export { getInitialState, isThisTemplate } from './model/utils';
export { MAX_COUNT_BUNCH_TEMPLATES, TEMPLATES_MOCK_DATA } from './model/consts';
// Zustand-стор
export { useDashboardTemplatesStore } from './model/store';
export type { DashboardTemplatesStore } from './model/store';
