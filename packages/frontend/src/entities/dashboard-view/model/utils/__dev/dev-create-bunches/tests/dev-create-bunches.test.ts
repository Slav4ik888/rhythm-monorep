import { devCreateBunches } from '..';
import { ViewItem } from '../../../../../types';


describe('devCreateBunches', () => {
  // Генератор тестовых данных
  const generateTestItems = (count: number): ViewItem[] =>
    Array(count).fill(null).map((_, i) => ({
      id: `item-${i}`,
      bunchId: 'temp', // будет перезаписано
      data: `content-${i}`
    }) as unknown as ViewItem);

  test('should return empty array for empty input', () => {
    const result = devCreateBunches([]);
    expect(result).toEqual([]);
  });

  test('should create single bunch for items < 100', () => {
    const items = generateTestItems(50);
    const result = devCreateBunches(items);

    expect(result.length).toBe(1);
    expect(Object.keys(result[0]).length).toBe(50);

    // Проверяем что все элементы имеют одинаковый bunchId
    // @ts-ignore
    const bunchIds = new Set(Object.values(result[0]).map(item => item.bunchId));
    expect(bunchIds.size).toBe(1);
  });

  test('should create multiple bunches for items > 100', () => {
    const items = generateTestItems(250);
    const result = devCreateBunches(items);

    expect(result.length).toBe(3);
    expect(Object.keys(result[0]).length).toBe(100);
    expect(Object.keys(result[1]).length).toBe(100);
    expect(Object.keys(result[2]).length).toBe(50);

    // Проверяем что bunchId уникальны между гроздьями
    const allBunchIds = result.flatMap(bunch =>
    // @ts-ignore
      Object.values(bunch).map(item => item.bunchId)
    );
    const uniqueBunchIds = new Set(allBunchIds);
    expect(uniqueBunchIds.size).toBe(3);
  });

  test('should maintain item data integrity', () => {
    const items = generateTestItems(5);
    // @ts-ignore
    items[0].data = 'special-content';

    const result = devCreateBunches(items);
    const firstBunchItems = Object.values(result[0]);

    // @ts-ignore
    expect(firstBunchItems.some(i => i.data === 'special-content')).toBe(true);
    // @ts-ignore
    expect(firstBunchItems.map(i => i.id)).toEqual(
      expect.arrayContaining(['item-0', 'item-1', 'item-2', 'item-3', 'item-4'])
    );
  });

  test('should handle exact multiples of bunch size', () => {
    const items = generateTestItems(200);
    const result = devCreateBunches(items);

    expect(result.length).toBe(2);
    expect(Object.keys(result[0]).length).toBe(100);
    expect(Object.keys(result[1]).length).toBe(100);
  });

  test('should generate valid UUIDs for bunchIds', () => {
    const items = generateTestItems(10);
    const result = devCreateBunches(items);
    // @ts-ignore
    const { bunchId } = Object.values(result[0])[0];

    expect(bunchId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('should preserve original item properties', () => {
    const specialItem = {
      id: 'special-id',
      bunchId: 'will-be-overwritten',
      data: { complex: { object: true } },
      extraField: 'value'
    };

    // @ts-ignore
    const result = devCreateBunches([specialItem]);
    const storedItem = result[0]['special-id'];

    // @ts-ignore
    expect(storedItem.data).toEqual({ complex: { object: true } });
    // @ts-ignore
    expect(storedItem.extraField).toBe('value');
    // @ts-ignore
    expect(storedItem.bunchId).not.toBe('will-be-overwritten');
  });
});



// npm run test:unit dev-create-bunches.test.ts
