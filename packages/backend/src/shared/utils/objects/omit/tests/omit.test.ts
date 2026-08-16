// packages/backend/src/shared/utils/objects/omit/tests/omit.test.ts

import { omit } from '..';

describe('omit', () => {
  it('убирает указанные поля', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('не трогает остальные поля', () => {
    const result = omit({ a: 1, b: 2 }, ['x'] as never[]);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('не мутирует исходный объект', () => {
    const obj = { a: 1, b: 2 };
    omit(obj, ['a']);
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
