// packages/frontend/src/features/dashboard-data/set-period-date/utils/get-ms-from-ref/tests/get-ms-from-ref.test.ts
// Unit-тест извлечения timestamp из ref инпута.

import type { MutableRefObject } from 'react';
import { getMsFromRef } from '..';

describe('getMsFromRef', () => {
  it('возвращает timestamp из value инпута в ref', () => {
    const ref = { current: { value: '2024-01-15' } } as MutableRefObject<HTMLInputElement>;

    expect(getMsFromRef(ref)).toBe(new Date('2024-01-15').getTime());
  });

  it('возвращает NaN, если ref пустой', () => {
    const ref = { current: null } as unknown as MutableRefObject<HTMLInputElement>;

    expect(getMsFromRef(ref)).toBeNaN();
  });
});
