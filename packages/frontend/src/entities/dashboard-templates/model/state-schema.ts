// packages/frontend/src/entities/dashboard-templates/model/state-schema.ts

import type { Template } from './types';
import type { Errors } from 'shared/lib/validators';
import type { BunchesUpdated } from 'shared/lib/structures/bunch';

export interface DashboardTemplatesEntities {
  [templateId: string]: Template;
}

export interface StateSchemaDashboardTemplates {
  loading: boolean;
  errors: Errors;
  _isMounted: boolean;
  bunchesUpdated: BunchesUpdated | undefined;
  entities: DashboardTemplatesEntities;
  opened: boolean;
  selectedId: string | undefined;
  storedSelected: Template | undefined;
}
