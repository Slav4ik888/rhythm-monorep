import { ViewItem, BunchesViewItem } from '../../../../types';
import { getBunchesFromViewItems } from '..';



describe('getBunchesFromViewItems', () => {
  // Mock данные для тестов
  const mockViewItems: ViewItem[] = [
    { id: 'item1', bunchId: 'bunch1', name: 'Item 1' } as unknown as ViewItem,
    { id: 'item2', bunchId: 'bunch1', name: 'Item 2' } as unknown as ViewItem,
    { id: 'item3', bunchId: 'bunch2', name: 'Item 3' } as unknown as ViewItem,
    { id: 'item4', bunchId: 'bunch1', name: 'Item 4' } as unknown as ViewItem,
    { id: 'item5', bunchId: 'bunch3', name: 'Item 5' } as unknown as ViewItem,
  ];

  const expectedResult: BunchesViewItem = {
    bunch1: {
      item1: { id: 'item1', bunchId: 'bunch1', name: 'Item 1' } as unknown as ViewItem,
      item2: { id: 'item2', bunchId: 'bunch1', name: 'Item 2' } as unknown as ViewItem,
      item4: { id: 'item4', bunchId: 'bunch1', name: 'Item 4' } as unknown as ViewItem,
    },
    bunch2: {
      item3: { id: 'item3', bunchId: 'bunch2', name: 'Item 3' } as unknown as ViewItem,
    },
    bunch3: {
      item5: { id: 'item5', bunchId: 'bunch3', name: 'Item 5' } as unknown as ViewItem,
    },
  };

  it('should correctly convert ViewItem[] to BunchesViewItem', () => {
    const result = getBunchesFromViewItems(mockViewItems);
    expect(result).toEqual(expectedResult);
  });

  it('should return empty object for empty array', () => {
    const result = getBunchesFromViewItems([]);
    expect(result).toEqual({});
  });

  it('should return empty object for null or undefined input', () => {
    expect(getBunchesFromViewItems(null as any)).toEqual({});
    expect(getBunchesFromViewItems(undefined as any)).toEqual({});
  });

  it('should handle single item', () => {
    const singleItem = [{ id: 'item1', bunchId: 'bunch1', name: 'Single Item' } as unknown as ViewItem];
    const result = getBunchesFromViewItems(singleItem);
    expect(result).toEqual({
      bunch1: {
        item1: { id: 'item1', bunchId: 'bunch1', name: 'Single Item' },
      },
    });
  });

  it('should preserve all item properties', () => {
    const itemsWithExtraProps: ViewItem[] = [
      {
        id: 'item1',
        bunchId: 'bunch1',
        name: 'Item 1',
        extraProp: 'value',
        anotherProp: 123,
      } as unknown as ViewItem,
    ];
    const result = getBunchesFromViewItems(itemsWithExtraProps);
    expect(result.bunch1.item1).toEqual(itemsWithExtraProps[0]);
  });

  it('should handle items with same id but different bunchId', () => {
    const items = [
      { id: 'item1', bunchId: 'bunch1', name: 'Item 1' } as unknown as ViewItem,
      { id: 'item1', bunchId: 'bunch2', name: 'Item 1' } as unknown as ViewItem,
    ];
    const result = getBunchesFromViewItems(items);
    expect(result).toEqual({
      bunch1: {
        item1: { id: 'item1', bunchId: 'bunch1', name: 'Item 1' },
      },
      bunch2: {
        item1: { id: 'item1', bunchId: 'bunch2', name: 'Item 1' },
      },
    });
  });

  it('should not mutate input array', () => {
    const inputCopy = [...mockViewItems];
    getBunchesFromViewItems(inputCopy);
    expect(inputCopy).toEqual(mockViewItems);
  });
});


// npm run test:unit get-bunches-from-viewitems.test.ts
