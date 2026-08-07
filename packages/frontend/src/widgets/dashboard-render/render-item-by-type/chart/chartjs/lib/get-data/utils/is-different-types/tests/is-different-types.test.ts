import { DashboardStatisticItem } from 'entities/dashboard-data';
import { isDifferentTypes } from '..';


describe('isDifferentTypes', () => {
  test('Invalid data: items is undefined', () => {
    expect(isDifferentTypes(undefined as unknown as DashboardStatisticItem<number>[])).toEqual(false);
  });

  test('Invalid data: items is empty', () => {
    expect(isDifferentTypes([] as unknown as DashboardStatisticItem<number>[])).toEqual(false);
  });

  test('Есть различие в типах', () => {
    const items = [
      { periodType: 'day' },
      { periodType: 'day' },
      { periodType: 'day' },
      { periodType: 'week' },
      { periodType: 'day' },
    ];

    expect(isDifferentTypes(items as unknown as DashboardStatisticItem<number>[])).toEqual(true);
  });
  test('Нет различий в типах', () => {
    const items = [
      { periodType: 'day' },
      { periodType: 'day' },
      { periodType: 'day' },
      { periodType: 'day' },
    ];

    expect(isDifferentTypes(items as unknown as DashboardStatisticItem<number>[])).toEqual(false);
  });
});

// npm run test:unit is-different-types.test.ts
