import { calcTrend2 } from '..';


describe('calcTrend2', () => {
  test('valid values', () => {
    const dates = ['first', 'second', 'third', 'fourth', 'fifth', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen'];
    const y = [NaN, NaN, 10, 0, NaN, NaN, NaN, NaN, 15, 35, NaN, 15, NaN];

    const res = calcTrend2(dates, y).map(item => Number(item.toFixed(3)));

    // @ts-ignore
    expect(res).toEqual([NaN, NaN, 1.818, 4.303, 6.788, 9.273, 11.758, 14.242, 16.727, 19.212, 21.697, 24.182, NaN]);
    expect(res.length === dates.length).toBe(true);
  });

  test('invalid dates', () => {
    const y = [10, 0, 15, 35, NaN, 20, NaN];
    // @ts-ignore
    expect(calcTrend2(undefined, y)).toEqual([]);
  });


  test('invalid items', () => {
    const dates = ['first', 'second', 'third', 'fourth', 'fifth', 'six', 'seven'];
    // @ts-ignore
    expect(calcTrend2(dates, undefined)).toEqual([]);
  });
});

// npm run test:unit calc-trend-2.test.ts
