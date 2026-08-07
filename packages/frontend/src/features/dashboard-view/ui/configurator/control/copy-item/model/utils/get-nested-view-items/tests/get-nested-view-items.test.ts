import { ViewItem } from 'entities/dashboard-view';
import { getNestedViewItems } from '..';


describe('getNestedViewItems', () => {
  const items = [
    { id: '1',  parentId: 'no_parentId' },
    { id: '2',  parentId: 'no_parentId' },
    { id: '3',  parentId: 'no_parentId' },
    { id: '4',  parentId: '1' },
    { id: '5',  parentId: '2' },
    { id: '6',  parentId: '3' },
    { id: '7',  parentId: '1' },
    { id: '8',  parentId: '2' },
    { id: '9',  parentId: '3' },
    { id: '10', parentId: '4' },
    { id: '11', parentId: '4' },
    { id: '12', parentId: '4' },
    { id: '13', parentId: 'no_parentId' },
    { id: '14', parentId: 'no_parentId' },
    { id: '15', parentId: '12' },
    { id: '16', parentId: '11' },
    { id: '17', parentId: 'no_parentId' },
    { id: '18', parentId: '15' },
    { id: '19', parentId: '18' },
    { id: '20', parentId: '18' },
  ];

  test('Correct selectedId', () => {
    const result = getNestedViewItems(items as ViewItem[], '4');
    // console.log(result);

    expect(result).toEqual([
      { id: '4',  parentId: '1' },
      { id: '10', parentId: '4' },
      { id: '11', parentId: '4' },
      { id: '16', parentId: '11' },
      { id: '12', parentId: '4' },
      { id: '15', parentId: '12' },
      { id: '18', parentId: '15' },
      { id: '19', parentId: '18' },
      { id: '20', parentId: '18' },
    ]);
  });

  test('Invalid selectedId', () => {
    expect(getNestedViewItems(items as ViewItem[], '100500')).toEqual([]);
  });

  test('Invalid selectedId is undefined', () => {
    expect(getNestedViewItems(items as ViewItem[], undefined)).toEqual([]);
  });

  test('Invalid items', () => {
    const result = getNestedViewItems(undefined as unknown as ViewItem[], '100500');
    // console.log(result);

    expect(result).toEqual([]);
  });
});

// npm run test:unit get-nested-view-items.test.ts
