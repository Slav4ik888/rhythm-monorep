import { calcNanValue } from '..';


describe('calcNanValue', () => {
  test('Value is a number', () => {
    expect(calcNanValue([10, 20, 30, 40, 50], 100500, 1)).toEqual(100500);
  });

  test('NaN is one in the middle in array', () => {
    expect(calcNanValue([10, 20, NaN, 40, 50], NaN, 2)).toEqual(30);
  });

  test('NaN is some in the middle in array', () => {
    expect(calcNanValue([10, 20, NaN,  NaN,  NaN, 40, 50], NaN, 2)).toEqual(25);
  });

  test('NaN is some in the middle in array', () => {
    expect(calcNanValue([10, 20, NaN,  NaN,  NaN, 40, 50], NaN, 3)).toEqual(30);
  });

  test('NaN между двумя цифрами', () => {
    expect(calcNanValue([10, 20, NaN,  NaN,  NaN, 35, NaN, 15], NaN, 6)).toEqual(25);
  });

  test('NaN is some in the middle in array', () => {
    expect(calcNanValue([10, 20, NaN,  NaN,  NaN, 40, 50], NaN, 4)).toEqual(35);
  });

  test('Если нет prev & next', () => {
    expect(calcNanValue([NaN], NaN, 0)).toEqual(undefined);
  });
});

// npm run test:unit calc-nan-value.test.ts
