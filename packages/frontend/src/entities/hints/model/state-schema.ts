// packages/frontend/src/entities/hints/model/state-schema.ts

import type { Errors } from 'shared/lib/validators';

export interface StateSchemaHints {
  loading: boolean;
  errors: Errors;
  hintsQueue: string[];
  shownHints: string[];
  currentHintId: string | null;
}
