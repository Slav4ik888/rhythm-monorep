import { calcGrowthChange } from '..';


describe('calcGrowthChange', () => {
  // Grow
  test('last 110, prev 100, result 10', () => expect(calcGrowthChange(110, 100)).toEqual(10));
  test('last -90, prev -100, result 10', () => expect(calcGrowthChange(-90, -100)).toEqual(10));
  test('last 1000, prev -1000, result 200', () => expect(calcGrowthChange(1000, -1000)).toEqual(200));

  // Fall
  test('last 90, prev 100, result -10', () => expect(calcGrowthChange(90, 100)).toEqual(-10));
  test('last -110, prev -100, result -10', () => expect(calcGrowthChange(-110, -100)).toEqual(-10));
  test('last -1000, prev 1000, result 200', () => expect(calcGrowthChange(-1000, 1000)).toEqual(-200));

  // Not valid data
  test('last 0, prev 200, result -100', () => expect(calcGrowthChange(0, 200)).toEqual(-100));
  test('last 2000, prev 0, result ', () => expect(calcGrowthChange(2000, 0)).toEqual(undefined));
});

// npm run test:unit calc-growth-change.test.ts
