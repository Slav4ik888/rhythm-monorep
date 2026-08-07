import { calcTrend } from '..';


describe('calcTrend', () => {
  test('valid values', () => {
    const dates = ['first', 'second', 'third', 'fourth', 'fifth', 'six', 'seven'];
    const y = [10, 0, 15, 35, undefined, 20, 25];
    // @ts-ignore
    expect(calcTrend(dates, y)).toEqual([7.50, 10, 12.5, 15, 17.5, 20, 22.5]);
  });


  test('invalid dates', () => {
    const y = [10, 0, 15, 35, undefined, 20, 25];
    // @ts-ignore
    expect(calcTrend(undefined, y)).toEqual([]);
  });


  test('invalid items', () => {
    const dates = ['first', 'second', 'third', 'fourth', 'fifth', 'six', 'seven'];
    // @ts-ignore
    expect(calcTrend(dates, undefined)).toEqual([]);
  });
});

// npm run test:unit calc-trend.test.ts
