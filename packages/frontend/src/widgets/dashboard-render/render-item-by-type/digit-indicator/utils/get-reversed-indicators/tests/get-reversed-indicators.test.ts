import { getReversedIndicators } from '..';



describe('getReversedIndicators', () => {
  test('should return empty array for empty input array', () => {
    expect(getReversedIndicators([])).toEqual([]);
    expect(getReversedIndicators(null as any)).toEqual([]);
    expect(getReversedIndicators(undefined as any)).toEqual([]);
  });

  test('should return last 2 values by default', () => {
    const input = [1, 2, 3, 4, 5];
    const result = getReversedIndicators(input);
    expect(result).toEqual([5, 4]);
  });

  test('should return specified number of values', () => {
    const input = [10, 20, 30, 40, 50];
    expect(getReversedIndicators(input, 3)).toEqual([50, 40, 30]);
    expect(getReversedIndicators(input, 5)).toEqual([50, 40, 30, 20, 10]);
  });

  test('should not return more values than array length', () => {
    const input = [1, 2, 3];
    expect(getReversedIndicators(input, 5)).toEqual([3, 2, 1]);
  });

  test('should apply correction factor to values', () => {
    const input = [10, 20, 30];
    expect(getReversedIndicators(input, 2, 2)).toEqual([60, 40]);
    expect(getReversedIndicators(input, 3, 0.5)).toEqual([15, 10, 5]);
  });

  test('should handle countValues less than 2 by using 2', () => {
    const input = [1, 2, 3, 4];
    expect(getReversedIndicators(input, 1)).toEqual([4, 3]);
    expect(getReversedIndicators(input, 0)).toEqual([4, 3]);
    expect(getReversedIndicators(input, -1)).toEqual([4, 3]);
  });

  test('should work with non-integer values', () => {
    const input = [1.5, 2.3, 3.7];
    expect(getReversedIndicators(input, 2)).toEqual([3.7, 2.3]);
    expect(getReversedIndicators(input, 2, 2)).toEqual([7.4, 4.6]);
  });

  test('should handle non-number values with toNumber and isNum', () => {
    const input = [1, 'a', true] as any;
    expect(getReversedIndicators(input, 2)).toEqual([true, 'a']);
  });
});

describe('getReversedIndicators', () => {
  const ARRAY = [1, 2, 3, 4, 5, 6, 7, 8];

  test('countValues is undefined', () => {
    expect(getReversedIndicators(ARRAY, undefined as unknown as number)).toEqual([8, 7]);
  });

  test('array is undefined', () => {
    expect(getReversedIndicators(undefined as unknown as number[], 3)).toEqual([]);
  });

  test('countValues = 0', () => {
    expect(getReversedIndicators(ARRAY, 0)).toEqual([8, 7]);
  });

  test('countValues = 1', () => {
    expect(getReversedIndicators(ARRAY, 1)).toEqual([8, 7]);
  });

  test('countValues = 3', () => {
    expect(getReversedIndicators(ARRAY, 3)).toEqual([8, 7, 6]);
  });

  test('countValues = длине всего массива', () => {
    expect(getReversedIndicators(ARRAY, 8)).toEqual([8, 7, 6, 5, 4, 3, 2, 1]);
  });

  test('countValues > длины всего массива', () => {
    expect(getReversedIndicators(ARRAY, 9)).toEqual([8, 7, 6, 5, 4, 3, 2, 1]);
  });
});

// npm run test:unit get-reversed-indicators.test.ts
