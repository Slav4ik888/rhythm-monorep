import { isPx } from '..';


describe('isPx', () => {
  test('value is ""', () => expect(isPx('')).toEqual(false));
  test('value is "-"', () => expect(isPx('-')).toEqual(false));
  test('value is "max-content"', () => expect(isPx('max-content')).toEqual(false));
  test('value is 0', () => expect(isPx(0)).toEqual(true));
  test('value is 12', () => expect(isPx(12)).toEqual(true));
  test('value is -2', () => expect(isPx(-2)).toEqual(true));
  test('value is undefined', () => expect(isPx(undefined)).toEqual(true));
});

// npm run test:unit is-px.test.ts
