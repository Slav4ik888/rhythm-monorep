// packages/backend/src/shared/utils/objects/filter-ents-by-field/index.ts

import { isArr } from '../../../../libs/validators';
import type { Item, Entities } from '../../arrays';

function getValidator<T>(value: T | T[], includes?: boolean, validFunc?: (ent: Item, value: T) => boolean) {
  if (validFunc) {
    return (ents: Item, field: string, v: T, id: string) => validFunc(ents[id] as Item, v);
  }

  if (isArr(value)) {
    if (includes) return (ents: Item, field: string, v: T[], id: string) => (ents[id] as Item)[field]?.includes(v);
    else return (ents: Item, field: string, v: T[], id: string) => v.includes((ents[id] as Item)[field]);
  } else if (includes) return (ents: Item, field: string, v: T, id: string) => (ents[id] as Item)[field]?.includes(v);
  else return (ents: Item, field: string, v: T, id: string) => (ents[id] as Item)[field] === v;
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
  validFunc?: (ent: Item, value: T) => boolean,
): Entities<O> {
  const ents = {};
  if (!field || typeof value === 'undefined') return ents;

  const validator = getValidator(value, includes, validFunc);

  /* eslint-disable-next-line guard-for-in, no-restricted-syntax */
  for (const id in entities) {
    if (Object.prototype.hasOwnProperty.call(entities, id)) {
      // @ts-ignore
      if (validator(entities, field, value, id)) ents[id] = entities[id];
    }
  }

  return ents;
}
