import { ViewItem } from 'entities/dashboard-view';
import { getAllChildren } from '..';



describe('getAllChildren', () => {
  test('Data is valid', () => {
    const items = [
      { id: '1',         bunchId: 'bunch1', parentId: 'no-parentId' },
      { id: '1-1',       bunchId: 'bunch1', parentId: '1' },
      { id: '1-2',       bunchId: 'bunch1', parentId: '1' },
      { id: '1-3',       bunchId: 'bunch1', parentId: '1' },
      { id: '1-2-1',     bunchId: 'bunch1', parentId: '1-2' },
      { id: '1-2-2',     bunchId: 'bunch1', parentId: '1-2' },
      { id: '1-2-3',     bunchId: 'bunch1', parentId: '1-2' },
      { id: '1-2-1-1',   bunchId: 'bunch1', parentId: '1-2-1' },
      { id: '1-2-1-2',   bunchId: 'bunch222', parentId: '1-2-1' },
      { id: '1-2-1-3',   bunchId: 'bunch1', parentId: '1-2-1' },
      { id: '1-2-1-3-1', bunchId: 'bunch1', parentId: '1-2-1-3' },
      { id: '1-2-1-3-2', bunchId: 'bunch333', parentId: '1-2-1-3' },
      { id: '1-2-1-3-3', bunchId: 'bunch1', parentId: '1-2-1-3' },
      { id: '2',         bunchId: 'bunch1', parentId: '' },
      { id: '2-1',       bunchId: 'bunch1', parentId: '' },
      { id: '2-2',       bunchId: 'bunch1', parentId: '' },
      { id: '2-3',       bunchId: 'bunch1', parentId: '' },
      { id: '2-2-1',     bunchId: 'bunch1', parentId: '' },
      { id: '2-2-2',     bunchId: 'bunch1', parentId: '' },
      { id: '2-2-3',     bunchId: 'bunch1', parentId: '' },
     ] as ViewItem[];

    const resultArray = getAllChildren(items, '1-2');

    expect(resultArray).toEqual([
      { id: '1-2', bunchId: 'bunch1', parentId: '1' },
      { id: '1-2-1', bunchId: 'bunch1', parentId: '1-2' },
      { id: '1-2-1-1', bunchId: 'bunch1', parentId: '1-2-1' },
      { id: '1-2-1-2', bunchId: 'bunch222', parentId: '1-2-1' },
      { id: '1-2-1-3', bunchId: 'bunch1', parentId: '1-2-1' },
      { id: '1-2-1-3-1', bunchId: 'bunch1', parentId: '1-2-1-3' },
      { id: '1-2-1-3-2', bunchId: 'bunch333', parentId: '1-2-1-3' },
      { id: '1-2-1-3-3', bunchId: 'bunch1', parentId: '1-2-1-3' },
      { id: '1-2-2', bunchId: 'bunch1', parentId: '1-2' },
      { id: '1-2-3', bunchId: 'bunch1', parentId: '1-2' },
    ]);
  });

  const mockItems = [
    { id: '1', bunchId: 'bunchA', parentId: null },
    { id: '2', bunchId: 'bunchA', parentId: '1' },
    { id: '3', bunchId: 'bunchB', parentId: '1' },
    { id: '4', bunchId: 'bunchA', parentId: '2' },
    { id: '5', bunchId: 'bunchB', parentId: '3' },
    { id: '6', bunchId: 'bunchC', parentId: null }, // отдельное дерево
  ] as ViewItem[];

  it('должна возвращать текущий элемент и всех его детей с bunchId', () => {
    const result = getAllChildren(mockItems, '1');

    expect(result).toEqual([
      { id: '1', bunchId: 'bunchA', parentId: null },
      { id: '2', bunchId: 'bunchA', parentId: '1' },
      { id: '4', bunchId: 'bunchA', parentId: '2' },
      { id: '3', bunchId: 'bunchB', parentId: '1' },
      { id: '5', bunchId: 'bunchB', parentId: '3' },
    ]);
  });

  it('должна возвращать только сам элемент, если у него нет детей', () => {
    const result = getAllChildren(mockItems, '6');

    expect(result).toEqual([
      { id: '6', bunchId: 'bunchC', parentId: null },
    ]);
  });

  it('должна возвращать пустой массив, если элемент не найден', () => {
    const result = getAllChildren(mockItems, 'non-existent');

    expect(result).toEqual([]);
  });
});

// npm run test:unit get-all-children.test.ts
