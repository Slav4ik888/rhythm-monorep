// packages/backend/src/shared/utils/objects/filter-ents-by-field/index.ts

import { isArr } from '../../../../libs/validators';
import type { Entities } from '../../arrays';

type EntsRecord = Record<string, Record<string, unknown>>;

type Validator<T> = (ents: EntsRecord, field: string, v: T, id: string) => boolean;

// eslint-disable-next-line max-len
function getValidator<T>(
  value: T | T[],
  includes?: boolean,
  validFunc?: (ent: Record<string, unknown>, value: T) => boolean,
): Validator<T> {
  if (validFunc) {
    return (ents: EntsRecord, field: string, v: T, id: string) => validFunc(ents[id], v);
  }

  if (Array.isArray(value)) {
    if (includes)
      return (ents: EntsRecord, field: string, v: T, id: string) => (ents[id][field] as unknown[])?.includes(v);
    else
      return (ents: EntsRecord, field: string, v: T, id: string) =>
        (v as unknown as unknown[]).includes(ents[id][field]);
  } else if (includes)
    return (ents: EntsRecord, field: string, v: T, id: string) => (ents[id][field] as unknown[])?.includes(v);
  else return (ents: EntsRecord, field: string, v: T, id: string) => ents[id][field] === v;
}

/**
 * v.2023-05-08
 * Filter ents by field value
 * Возвращает объект с полями значения который равны value
 */
export function filterEntsByField<O extends object, T>(
  entities: Entities<O>,
  field: string,
  value: T | T[],
  includes?: boolean,
  validFunc?: (ent: Record<string, unknown>, value: T) => boolean,
): Entities<O> {
  const ents: Entities<O> = {};
  if (!field || typeof value === 'undefined') return ents;

  const validator = getValidator(value, includes, validFunc);

  /* eslint-disable-next-line guard-for-in, no-restricted-syntax */
  for (const id in entities) {
    if (Object.prototype.hasOwnProperty.call(entities, id)) {
      // @ts-expect-error validator работает с EntsRecord, entities — Entities<O extends object>
      if (validator(entities, field, value, id)) ents[id] = entities[id];
    }
  }

  return ents;
}
