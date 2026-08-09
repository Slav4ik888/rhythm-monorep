// packages/frontend/src/entities/transactions/model/state-schema.ts

import type { Errors } from 'shared/lib/validators';

export interface StateSchemaTransactions {
  loading: boolean;
  errors: Errors;
}
