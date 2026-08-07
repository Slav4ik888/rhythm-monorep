import { DashboardViewEntities, ViewItem } from 'entities/dashboard-view';
import { getInverted } from '..';


describe('getInverted', () => {
  // Моки для тестовых данных
  const createItem = (settings: Partial<ViewItem['settings']> = {}, id = 'item-1'): ViewItem => ({
    id,
    type: 'box',
    styles: {},
    settings: { ...settings }
  } as ViewItem);

  const createEntities = (items: ViewItem[]): DashboardViewEntities => ({
    // @ts-ignore
    items: Object.fromEntries(items.map(item => [item.id, item])),
    // Другие поля entities, если они используются в getFirstItemInBranchWithGlobalKod
  });

  // 1. Базовый случай - нет fromGlobalKod
  test('should return item.inverted when fromGlobalKod is not set', () => {
    const item = createItem({ inverted: true });
    const entities = createEntities([item]);

    expect(getInverted(item, entities)).toBe(true);
  });

  // 2. fromGlobalKod установлен, но нет родителя с globalInverted
  test('should return item.inverted when fromGlobalKod is set but no parent with globalInverted', () => {
    const item = createItem({ fromGlobalKod: true, inverted: false });
    const entities = createEntities([item]);

    expect(getInverted(item, entities)).toBe(false);
  });

  // 3. fromGlobalKod установлен и есть родитель с globalInverted: true
  test('should return parent.globalInverted when fromGlobalKod is set and parent exists', () => {
    const parent = createItem({ globalInverted: true }, 'parent-1');
    const child = createItem({ fromGlobalKod: true }, 'child-1');
    const entities = createEntities([parent, child]);

    // Предполагаем, что getFirstItemInBranchWithGlobalKod найдет parent
    // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
    jest.spyOn(require('entities/dashboard-view'), 'getFirstItemInBranchWithGlobalKod')
      .mockReturnValue(parent);

    expect(getInverted(child, entities)).toBe(true);
  });

  // 4. fromGlobalKod установлен и есть родитель с globalInverted: false
  test('should return parent.globalInverted (false) when fromGlobalKod is set', () => {
    const parent = createItem({ globalInverted: false }, 'parent-1');
    const child = createItem({ fromGlobalKod: true, inverted: true }, 'child-1');
    const entities = createEntities([parent, child]);

    // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
    jest.spyOn(require('entities/dashboard-view'), 'getFirstItemInBranchWithGlobalKod')
      .mockReturnValue(parent);

    expect(getInverted(child, entities)).toBe(false);
  });

  // 5. fromGlobalKod установлен, и есть родитель но нет имеет globalInverted
  test('should fallback to item.inverted when parent has no globalInverted', () => {
    const parent = createItem({}, 'parent-1'); // Нет globalInverted
    const child = createItem({ fromGlobalKod: true, inverted: true }, 'child-1');
    const entities = createEntities([parent, child]);

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    jest.spyOn(require('entities/dashboard-view'), 'getFirstItemInBranchWithGlobalKod')
      .mockReturnValue(parent);

    expect(getInverted(child, entities)).toBe(false);
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
      const item = createItem(settings);
      const entities = createEntities([item]);
      expect(getInverted(item, entities)).toBe(expected);
    });
  });

  // 7. Проверка с undefined settings
  test('should handle item without settings', () => {
    const item = { id: 'item-1', type: 'box', styles: {} } as ViewItem;
    const entities = createEntities([item]);

    expect(getInverted(item, entities)).toBe(false);
  });
});

// npm run test:unit get-inverted.test.ts
