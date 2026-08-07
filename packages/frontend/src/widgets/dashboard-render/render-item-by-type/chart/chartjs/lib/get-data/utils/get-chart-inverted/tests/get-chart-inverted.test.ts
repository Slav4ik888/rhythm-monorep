import { DashboardViewEntities, ViewItem } from 'entities/dashboard-view';
import { getChartInverted } from '..';


describe('getChartInverted', () => {
  // Вспомогательная функция для создания тестового элемента
  const createChartItem = (
    chartsSettings: Array<{ fromGlobalKod?: boolean; inverted?: boolean }> = [],
    id = 'item-1'
  ): ViewItem => ({
    id,
    type: 'chart',
    styles: {},
    settings: {
      charts: chartsSettings.map(settings => ({ chartType: 'line', ...settings }))
    }
  } as ViewItem);

  // Вспомогательная функция для создания entities
  const createEntities = (items: ViewItem[]): DashboardViewEntities => ({
    // @ts-ignore
    items: Object.fromEntries(items.map(item => [item.id, item])),
    // Другие поля entities, если они используются
  });

  // 1. Базовый случай - нет fromGlobalKod
  test('should return chart.inverted when fromGlobalKod is not set', () => {
    const item = createChartItem([{ inverted: true }]);
    const entities = createEntities([item]);

    expect(getChartInverted(item, 0, entities)).toBe(true);
  });

  // 2. fromGlobalKod установлен, но нет родителя с globalInverted
  test('should return chart.inverted when fromGlobalKod is set but no parent with globalInverted', () => {
    const item = createChartItem([{ fromGlobalKod: true, inverted: false }]);
    const entities = createEntities([item]);

    expect(getChartInverted(item, 0, entities)).toBe(false);
  });

  // 3. fromGlobalKod установлен и есть родитель с globalInverted: true
  test('should return parent.globalInverted when fromGlobalKod is set and parent exists', () => {
    const parent = createChartItem([], 'parent-1');
    parent.settings!.globalInverted = true;

    const child = createChartItem([{ fromGlobalKod: true }], 'child-1');
    const entities = createEntities([parent, child]);

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    jest.spyOn(require('entities/dashboard-view'), 'getFirstItemInBranchWithGlobalKod')
      .mockReturnValue(parent);

    expect(getChartInverted(child, 0, entities)).toBe(true);
  });

  // 4-1. Проверка для конкретного индекса графика но не имеет родителя
  test('should check inverted for specific chart index, without parent', () => {
    const item = createChartItem([
      { inverted: true }, // index 0
      { fromGlobalKod: true, inverted: false }, // index 1
      { inverted: true } // index 2
    ]);
    const entities = createEntities([item]);

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    jest.spyOn(require('entities/dashboard-view'), 'getFirstItemInBranchWithGlobalKod')
      .mockReturnValue(undefined);

    expect(getChartInverted(item, 1, entities)).toBe(false);
  });

  // 4-2. Проверка для конкретного индекса графика
  test('should check inverted for specific chart index', () => {
    const parent = createChartItem([], 'parent-1');
    parent.settings!.globalInverted = true;

    const child = createChartItem([
      { inverted: false }, // index 0
      { fromGlobalKod: true, inverted: false }, // index 1
      { inverted: false } // index 2
    ]);
    const entities = createEntities([parent, child]);

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    jest.spyOn(require('entities/dashboard-view'), 'getFirstItemInBranchWithGlobalKod')
      .mockReturnValue(parent);

    expect(getChartInverted(child, 1, entities)).toBe(true);
  });

  // 5. fromGlobalKod установлен, но родитель не имеет globalInverted
  test('should fallback to chart.inverted when parent has no globalInverted', () => {
    const parent = createChartItem([], 'parent-1');
    const child = createChartItem([{ fromGlobalKod: true, inverted: true }], 'child-1');
    const entities = createEntities([parent, child]);

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    jest.spyOn(require('entities/dashboard-view'), 'getFirstItemInBranchWithGlobalKod')
      .mockReturnValue(parent);

    expect(getChartInverted(child, 0, entities)).toBe(false); // Потому-что globalInverted не обязательно отмечать
  });

  // 6. Проверка преобразования к boolean
  test('should always return boolean', () => {
    const testCases = [
      { settings: { inverted: 1 }, expected: true },
      { settings: { inverted: 0 }, expected: false },
      { settings: { inverted: null }, expected: false },
      { settings: { inverted: undefined }, expected: false },
    ];

    testCases.forEach(({ settings, expected }) => {
      // @ts-ignore
      const item = createChartItem([settings]);
      const entities = createEntities([item]);
      expect(getChartInverted(item, 0, entities)).toBe(expected);
    });
  });

  // 7. Граничный случай - пустой массив charts
  test('should handle empty charts array', () => {
    const item = createChartItem([]);
    const entities = createEntities([item]);

    expect(getChartInverted(item, 0, entities)).toBe(false);
  });

  // 8. Граничный случай - несуществующий индекс
  test('should handle non-existent chart index', () => {
    const item = createChartItem([{ inverted: true }]);
    const entities = createEntities([item]);

    expect(getChartInverted(item, 1, entities)).toBe(false);
  });

  // 9. Проверка с undefined settings
  test('should handle item without settings', () => {
    const item = { id: 'item-1', type: 'chart', styles: {} } as ViewItem;
    const entities = createEntities([item]);

    expect(getChartInverted(item, 0, entities)).toBe(false);
  });

  // 10
  test('should handle multiple charts with different settings', () => {
    const item = createChartItem([
      { inverted: true },
      { fromGlobalKod: true },
      { fromGlobalKod: false, inverted: true }
    ]);

    const entities = createEntities([item]);

    expect(getChartInverted(item, 0, entities)).toBe(true);
    expect(getChartInverted(item, 1, entities)).toBe(false);
    expect(getChartInverted(item, 2, entities)).toBe(true);
  });
});

// npm run test:unit get-chart-inverted.test.ts
