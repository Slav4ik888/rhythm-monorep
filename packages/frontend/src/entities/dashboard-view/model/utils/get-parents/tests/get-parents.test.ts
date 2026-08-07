import { ViewItem } from '../../../../types';
import { getParents } from '..';



describe('getParents', () => {
  test('items is undefined', () => {
    expect(getParents(undefined as unknown as ViewItem[])).toEqual({});
  });

  test('getParents', () => {
    const items = [
      { id: '1', parentId: 'no_parentId' },
      { id: '2', parentId: 'no_parentId' },
      { id: '3', parentId: 'no_parentId' },
      { id: '4', parentId: '1' },
      { id: '5', parentId: '2' },
      { id: '6', parentId: '3' },
      { id: '7', parentId: '1' },
      { id: '8', parentId: '2' },
      { id: '9', parentId: '3' },
      { id: '10', parentId: '4' },
      { id: '11', parentId: '4' },
      { id: '12', parentId: '4' },
      { id: '13', parentId: 'no_parentId' },
      { id: '14', parentId: 'no_parentId' },
    ];

    expect(getParents(items as ViewItem[])).toEqual({
      no_parentId: [
        { id: '1', parentId: 'no_parentId' },
        { id: '2', parentId: 'no_parentId' },
        { id: '3', parentId: 'no_parentId' },
        { id: '13', parentId: 'no_parentId' },
        { id: '14', parentId: 'no_parentId' },
      ],
      1: [
        { id: '4', parentId: '1' },
        { id: '7', parentId: '1' },
      ],
      2: [
        { id: '5', parentId: '2' },
        { id: '8', parentId: '2' },
      ],
      3: [
        { id: '6', parentId: '3' },
        { id: '9', parentId: '3' },
      ],
      4: [
        { id: '10', parentId: '4' },
        { id: '11', parentId: '4' },
        { id: '12', parentId: '4' },
      ]
    });
  });
});

// npm run test:unit get-parents.test.ts
