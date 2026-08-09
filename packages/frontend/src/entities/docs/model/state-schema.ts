// packages/frontend/src/entities/docs/model/state-schema.ts

import type { Errors } from 'shared/lib/validators';

export type DocKey = string;

/** Набор ключей документа с соответствующими значениями */
export interface DocKeys {
  [key: DocKey]: string;
}

export interface StateSchemaDocs {
  loading: boolean;
  errors: Errors;
  docKeys: DocKeys;
}
