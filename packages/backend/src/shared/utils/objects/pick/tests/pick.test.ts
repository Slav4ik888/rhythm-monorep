// packages/backend/src/shared/utils/objects/pick/tests/pick.test.ts

import { pick } from '..';

describe('pick', () => {
  it('оставляет только указанные поля', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('игнорирует отсутствующие поля', () => {
    expect(pick({ a: 1 }, ['a', 'x'] as never[])).toEqual({ a: 1 });
  });

  it('возвращает пустой объект для пустого входа', () => {
    expect(pick(undefined as never, ['a'])).toEqual({});
  });

  it('не мутирует исходный объект', () => {
    const obj = { a: 1, b: 2 };
    pick(obj, ['a']);
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
