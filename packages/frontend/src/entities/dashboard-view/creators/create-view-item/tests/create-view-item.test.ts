import { createViewItem } from '..';



describe('createViewItem', () => {
  const TEST_USER_ID = 'user-123';

  // Общие проверки для всех типов элементов
  test('should create item with default values when no config provided', () => {
    const item = createViewItem(TEST_USER_ID);

    expect(item).toMatchObject({
      id: expect.any(String),
      bunchId: expect.any(String),
      parentId: 'no_parentId',
      sheetId: 'no_sheetId',
      type: 'box',
      order: 1000,
      createdAt: expect.any(Object),
      lastChange: expect.any(Object),
    });

    expect(item.createdAt).toEqual({
      userId: TEST_USER_ID,
      date: expect.any(Number)
    });

    expect(item.lastChange).toEqual({
      userId: TEST_USER_ID,
      date: expect.any(Number)
    });

    expect(item.styles).toEqual(expect.objectContaining({
      display: 'flex',
      flexDirection: 'column',
      p: 24,
      width: '100%',
      minWidth: 40,
      height: 'max-content',
      minHeight: 40,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'rgba(146, 146, 146, 1)',
      borderRadius: 4,
      lineHeight: 1,
      m: 0,
    }));
  });

  test('should use provided config values when specified', () => {
    const customConfig = {
      id: 'custom-id',
      type: 'text',
      parentId: 'parent-1',
      order: 500,
    };

    // @ts-ignore
    const item = createViewItem(TEST_USER_ID, customConfig);

    expect(item).toMatchObject({
      id: 'custom-id',
      type: 'text',
      parentId: 'parent-1',
      order: 500,
    });
  });

  // Тесты для конкретных типов элементов
  test('should set default label for text type', () => {
    const item = createViewItem(TEST_USER_ID, { type: 'text' });
    expect(item.label).toBe('Введите заголовок');
  });

  test('should apply specific styles for box and text types', () => {
    const boxItem = createViewItem(TEST_USER_ID, { type: 'box' });
    const textItem = createViewItem(TEST_USER_ID, { type: 'text' });

    [boxItem, textItem].forEach(item => {
      expect(item.styles).toMatchObject({
        width: 'max-content',
        background: 'rgba(255, 255, 255, 0)',
        color: 'rgb(32, 32, 32)',
      });
    });
  });

  test('should initialize charts array for chart type', () => {
    const item = createViewItem(TEST_USER_ID, {
      type: 'chart',
      settings: { charts: [{ chartType: 'bar' }] }
    });

    expect(item.settings?.charts).toEqual([{ chartType: 'bar' }]);
  });

  test('should set default chart type if not provided', () => {
    const item = createViewItem(TEST_USER_ID, { type: 'chart' });
    expect(item.settings?.charts?.[0]?.chartType).toBe('line');
  });

  test('should apply specific styles for growthIcon type', () => {
    const item = createViewItem(TEST_USER_ID, { type: 'growthIcon' });
    expect(item.styles).toMatchObject({
      width: 20,
      // Проверяем, что применились стили из f('c-c-c')
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    });
  });

  test('should apply specific styles for digitIndicator type', () => {
    const item = createViewItem(TEST_USER_ID, { type: 'digitIndicator' });
    expect(item.styles).toMatchObject({
      width: 'max-content',
      p: 0,
      // Проверяем, что применились стили из f('r-c-c')
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    });
  });

  // Проверка работы с датами
  test('should set createdAt and lastChange to the same value', () => {
    const item = createViewItem(TEST_USER_ID);
    expect(item.createdAt.userId).toBe(item.lastChange.userId);
  });

  // Проверка клонирования объекта
  test('should not mutate input config object', () => {
    const inputConfig = { type: 'box', order: 200 };
    const inputConfigCopy = { ...inputConfig };

    // @ts-ignore
    createViewItem(TEST_USER_ID, inputConfig);

    expect(inputConfig).toEqual(inputConfigCopy);
  });
});

// npm run test:unit create-view-item.test.ts
