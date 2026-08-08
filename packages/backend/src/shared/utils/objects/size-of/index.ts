// packages/backend/src/shared/utils/objects/size-of/index.ts

import type { Item } from '../../arrays';

const calcBytes = (d: string): number => d.length * 2;

export function sizeOf(data: Item | number | string): number {
  let bytes = 0;

  if (!data || data === null || data === undefined) return bytes;

  switch (typeof data) {
    case 'number':
      bytes += 8;
      break;

    case 'string':
      bytes += calcBytes(data);
      break;

    case 'boolean':
      bytes += 4;
      break;

    case 'object':
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          bytes += sizeOf(key);
          bytes += sizeOf(data[key] as Item);
        }
      }
      break;

    /* eslint-disable-next-line no-fallthrough */
    default:
      break;
  }

  return bytes;
}
