import { getReducedWithPrefix } from '..';


describe('getReducedWithPrefix', () => {
  // invalid input
  test('undefined', () => expect(getReducedWithPrefix(undefined)).toEqual({ value: undefined }));

  // without changes
  test('0', () => expect(getReducedWithPrefix(0)).toEqual({ value: 0 }));
  test('1', () => expect(getReducedWithPrefix(1)).toEqual({ value: 1 }));
  test('999', () => expect(getReducedWithPrefix(999)).toEqual({ value: 999 }));
  test('-999', () => expect(getReducedWithPrefix(-999)).toEqual({ value: -999 }));

  // changed
  test('1999', () => expect(getReducedWithPrefix(1999)).toEqual({ value: 1.999, prefix: 'тыс' }));
  test('1222333', () => expect(getReducedWithPrefix(1222333)).toEqual({ value: 1.222333, prefix: 'млн' }));
  test('111222333', () => expect(getReducedWithPrefix(111222333)).toEqual({ value: 111.222333, prefix: 'млн' }));
  test('-111222333444', () => expect(getReducedWithPrefix(-111222333444)).toEqual({ value: -111.222333444, prefix: 'млрд' }));
  test('-111222333444555', () => expect(getReducedWithPrefix(-111222333444555)).toEqual({ value: -111.222333444555, prefix: 'трлн' }));
  test('111222333444555666', () => expect(getReducedWithPrefix(111222333444555666)).toEqual({ value: 111222.333444555666, prefix: 'трлн' }));

  // 'трлн' 'млрд' 'млн' 'тыс'
});

// npm run test:unit get-reduced-with-prefix.test.ts
