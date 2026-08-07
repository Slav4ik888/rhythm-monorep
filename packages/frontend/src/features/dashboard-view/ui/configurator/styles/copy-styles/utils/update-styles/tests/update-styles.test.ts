import { ViewItem } from 'entities/dashboard-view';
import { updateStyles } from '..';



describe('updateStyles', () => {
  // Mock данные для тестов
  const baseItem = {
    id: '1',
    styles: {
      color: 'red',
      fontSize: 17,
      background: '#fff'
    }
  } as ViewItem;

  const newStylesItem = {
    id: '2',
    styles: {
      color: 'blue',
      fontWeight: 'bold',
      borderStyle: 'solid'
    }
  } as unknown as ViewItem;

  it('should reset all old styles and apply new styles', () => {
    const result = updateStyles(baseItem, newStylesItem);

    // Проверяем что старые стили обнулены
    expect(result.color).toBe('blue'); // перезаписано новым значением
    expect(result.fontSize).toBe('');  // старый стиль обнулен
    expect(result.background).toBe(''); // старый стиль обнулен

    // Проверяем новые стили
    expect(result.fontWeight).toBe('bold');
    expect(result.borderStyle).toBe('solid');
  });

  it('should handle empty new styles', () => {
    const emptyStylesItem: ViewItem = { ...baseItem, styles: {} };
    const result = updateStyles(baseItem, emptyStylesItem);

    // Все старые стили должны быть обнулены
    expect(result.color).toBe('');
    expect(result.fontSize).toBe('');
    expect(result.background).toBe('');
  });

  it('should handle undefined selectedItem styles', () => {
    // @ts-ignore
    const noStylesItem: ViewItem = { ...baseItem, styles: undefined };
    const result = updateStyles(noStylesItem, newStylesItem);

    // Должны быть только новые стили
    expect(result.color).toBe('blue');
    expect(result.fontWeight).toBe('bold');
    expect(result.borderStyle).toBe('solid');

    // Проверяем что нет лишних свойств
    expect(result).toEqual(newStylesItem.styles);
  });

  it('should handle undefined copiedItem styles', () => {
    // @ts-ignore
    const noStylesItem: ViewItem = { ...baseItem, styles: undefined };
    const result = updateStyles(baseItem, noStylesItem);

    // Должны вернуться обнуленные старые стили
    expect(result.color).toBe('');
    expect(result.fontSize).toBe('');
    expect(result.background).toBe('');
  });

  it('should handle both undefined styles', () => {
    // @ts-ignore
    const item1: ViewItem = { ...baseItem, styles: undefined };
    // @ts-ignore
    const item2: ViewItem = { ...baseItem, styles: undefined };
    const result = updateStyles(item1, item2);

    expect(result).toEqual({});
  });

  it('should not modify original objects', () => {
    const originalSelected = JSON.parse(JSON.stringify(baseItem));
    const originalCopied = JSON.parse(JSON.stringify(newStylesItem));

    updateStyles(baseItem, newStylesItem);

    // Проверяем что исходные объекты не изменились
    expect(baseItem).toEqual(originalSelected);
    expect(newStylesItem).toEqual(originalCopied);
  });
});

// npm run test:unit update-styles.test.ts
