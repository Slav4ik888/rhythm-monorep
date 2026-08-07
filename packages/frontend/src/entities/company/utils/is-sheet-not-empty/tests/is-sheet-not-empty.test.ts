import { ViewItem } from 'entities/dashboard-view';
import { isSheetNotEmpty } from '..';



describe('isSheetNotEmpty', () => {
  const mockViewItems = [
    { sheetId: 'sheet1', parentId: 'no_parentId', id: '1' },
    { sheetId: 'sheet1', parentId: '1', id: '2' },
    { sheetId: 'sheet2', parentId: 'no_parentId', id: '3' },
    { sheetId: 'sheet2', parentId: '3', id: '4' },
  ] as ViewItem[];

  it('should return false when viewItems is empty', () => {
    expect(isSheetNotEmpty([], 'sheet1')).toBe(false);
    // @ts-ignore
    expect(isSheetNotEmpty(undefined, 'sheet1')).toBe(false);
    // @ts-ignore
    expect(isSheetNotEmpty(null, 'sheet1')).toBe(false);
  });

  it('should return true when sheet has root item (parentId === NO_PARENT_ID)', () => {
    expect(isSheetNotEmpty(mockViewItems, 'sheet1')).toBeTruthy();
    expect(isSheetNotEmpty(mockViewItems, 'sheet2')).toBeTruthy();
  });

  it('should return false when sheet has no root items', () => {
    // sheet3 нет в mockViewItems
    expect(isSheetNotEmpty(mockViewItems, 'sheet3')).toBeFalsy();
  });

  it('should return false when sheet has items but no root item', () => {
    const itemsWithOnlyChildren = [
      { sheetId: 'sheet4', parentId: 'some_parent', id: '5' },
    ] as ViewItem[];
    expect(isSheetNotEmpty(itemsWithOnlyChildren, 'sheet4')).toBeFalsy();
  });

  it('should correctly identify root items with strict equality check', () => {
    const itemsWithSimilarIds = [
      { sheetId: 'sheet5', parentId: 'no_parentId_but_not_exact', id: '6' },
    ] as ViewItem[];
    // Проверяем, что сравнение parentId строгое (=== NO_PARENT_ID)
    expect(isSheetNotEmpty(itemsWithSimilarIds, 'sheet5')).toBeFalsy();
  });
});


// npm run test:unit is-sheet-not-empty.test.ts
