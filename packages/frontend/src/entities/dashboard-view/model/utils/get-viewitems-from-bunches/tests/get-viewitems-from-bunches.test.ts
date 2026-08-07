import { BunchesViewItem, ViewItem } from '../../../../types';
import { getViewitemsFromBunches } from '..';


describe('getViewitemsFromBunches', () => {
  // Mock данные для тестов
  const mockBunches: BunchesViewItem = {
    bunch1: {
      item1: { id: 'item1', name: 'Item 1' } as unknown as ViewItem,
      item2: { id: 'item2', name: 'Item 2' } as unknown as ViewItem,
    },
    bunch2: {
      item3: { id: 'item3', name: 'Item 3' } as unknown as ViewItem,
    },
    bunch3: {
      item4: { id: 'item4', name: 'Item 4' } as unknown as ViewItem,
      item5: { id: 'item5', name: 'Item 5' } as unknown as ViewItem,
    },
  };

  it('should return all ViewItems from bunches', () => {
    const result = getViewitemsFromBunches(mockBunches);
    expect(result).toEqual([
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' },
      { id: 'item3', name: 'Item 3' },
      { id: 'item4', name: 'Item 4' },
      { id: 'item5', name: 'Item 5' },
    ]);
  });

  it('should return empty array when bunches is empty', () => {
    const result = getViewitemsFromBunches({});
    expect(result).toEqual([]);
  });

  it('should return empty array when bunches is null or undefined', () => {
    expect(getViewitemsFromBunches(null as any)).toEqual([]);
    expect(getViewitemsFromBunches(undefined as any)).toEqual([]);
  });

  it('should handle bunches with empty inner objects', () => {
    const bunchesWithEmpty: BunchesViewItem = {
      ...mockBunches,
      emptyBunch: {},
    };
    const result = getViewitemsFromBunches(bunchesWithEmpty);
    expect(result).toEqual([
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' },
      { id: 'item3', name: 'Item 3' },
      { id: 'item4', name: 'Item 4' },
      { id: 'item5', name: 'Item 5' },
    ]);
  });

  it('should maintain item order (bunch order and inner item order)', () => {
    const orderedBunches: BunchesViewItem = {
      firstBunch: {
        itemA: { id: 'itemA', name: 'Item A' } as unknown as ViewItem,
        itemB: { id: 'itemB', name: 'Item B' } as unknown as ViewItem,
      },
      secondBunch: {
        itemC: { id: 'itemC', name: 'Item C' } as unknown as ViewItem,
      },
    };
    const result = getViewitemsFromBunches(orderedBunches);
    expect(result.map(item => item.id)).toEqual(['itemA', 'itemB', 'itemC']);
  });

  it('should handle single item in single bunch', () => {
    const singleBunch: BunchesViewItem = {
      single: {
        onlyItem: { id: 'only', name: 'Only Item' } as unknown as ViewItem,
      },
    };
    const result = getViewitemsFromBunches(singleBunch);
    expect(result).toEqual([{ id: 'only', name: 'Only Item' }]);
  });
});

// npm run test:unit get-viewitems-from-bunches.test.ts
