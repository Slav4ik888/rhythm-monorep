import { ViewItem } from '../../../../types';
import { getChildren } from '..';
import { NO_PARENT_ID } from '../../../../consts';



describe('getChildren', () => {
  const mockViewItems = [
    {
      id: '1',
      parentId: NO_PARENT_ID, // Корневой элемент
    },
    {
      id: '1-1',
      parentId: '1', // Потомок элемента '1'
    },
    {
      id: '1-2',
      parentId: '1', // Потомок элемента '1'
    },
    {
      id: '1-2-1',
      parentId: '1-2', // Потомок элемента '1-2'
    },
    {
      id: '2',
      parentId: NO_PARENT_ID, // Другой корневой элемент
    },
  ] as ViewItem[];

  it('should return true if clicked inside an item (nested child by parentId)', () => {
    const result = getChildren(mockViewItems, '1');
    expect(result).toEqual([
      { id: '1-1', parentId: '1' },
      { id: '1-2', parentId: '1' }
    ]);
  });

  it('У "2" нет потомков', () => {
    const result = getChildren(mockViewItems, '2');
    expect(result).toEqual([]);
  });

  it('"3" нет вообще', () => {
    const result = getChildren(mockViewItems, '3');
    expect(result).toEqual([]);
  });

  it('id is undefined', () => {
    const result = getChildren(mockViewItems, undefined);
    expect(result).toEqual([]);
  });

  it('viewItems in undefined', () => {
    // @ts-ignore
    const result = getChildren(undefined, '1');
    expect(result).toEqual([]);
  });
});

// npm run test:unit get-children.test.ts
