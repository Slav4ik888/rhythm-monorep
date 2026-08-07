import { getDimension } from '..';


describe('getDimension', () => {
  test('value is valid', () => {
    expect(getDimension('string')).toEqual('string');
  });
  test('value is invalid', () => {
    expect(getDimension(123)).toEqual('in px');
  });
  test('value is empty str', () => {
    expect(getDimension('')).toEqual('-');
  });
  test('value is undefined', () => {
    expect(getDimension(undefined)).toEqual('in px');
  });
});

// npm run test:unit dimension.test.ts
