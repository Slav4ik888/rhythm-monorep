import { invertData } from '..';


describe('invertData', () => {
  test('data is undefined', () => {
    expect(invertData(undefined as unknown as number[])).toEqual([]);
  });

  test('data is undefined', () => {
    expect(invertData([1, 2, 3, -100, 0, -200, 5])).toEqual([-1, -2, -3, 100, 0, 200, -5]);
  });
});

// npm run test:unit invert-data.test.ts
