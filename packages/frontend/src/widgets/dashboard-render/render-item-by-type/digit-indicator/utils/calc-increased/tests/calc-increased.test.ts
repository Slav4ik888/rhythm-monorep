import { calcIncreased } from '..';


describe('calcIncreased', () => {
  test('lastValue is undefined', () => expect(calcIncreased(undefined as unknown as number, 10)).toEqual(-1));
  test('prevValue is undefined', () => expect(calcIncreased(10, undefined as unknown as number)).toEqual(1));
  test('lastValue > prevValue', () => expect(calcIncreased(10, 0)).toEqual(1));
  test('lastValue < prevValue', () => expect(calcIncreased(0, 10)).toEqual(-1));
  test('lastValue = prevValue', () => expect(calcIncreased(10, 10)).toEqual(0));

  // with inverted
  test('lastValue is undefined, with inverted', () => expect(calcIncreased(undefined as unknown as number, 10, true)).toEqual(1));
  test('prevValue is undefined, with inverted', () => expect(calcIncreased(10, undefined as unknown as number, true)).toEqual(-1));
  test('lastValue > prevValue, with inverted', () => expect(calcIncreased(10, 0, true)).toEqual(-1));
  test('lastValue < prevValue, with inverted', () => expect(calcIncreased(0, 10, true)).toEqual(1));
  test('lastValue = prevValue, with inverted', () => expect(calcIncreased(10, 10, true)).toEqual(0));
});

// npm run test:unit calc-increased.test.ts
