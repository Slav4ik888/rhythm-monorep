import { is } from '..';


describe('is', () => {
  // False result
  test('value is undefined', () => {
    expect(is(undefined)).toEqual(false);
  });
  test('value is undefined', () => {
    expect(is('')).toEqual(false);
  });

  // True result
  test('value is null', () => {
    expect(is(null)).toEqual(true);
  });
  test('value is number', () => {
    expect(is(1)).toEqual(true);
  });
  test('value is string', () => {
    expect(is('1')).toEqual(true);
  });
  test('value is 0', () => {
    expect(is(0)).toEqual(true);
  });
});

// npm run test:unit is.test.ts
