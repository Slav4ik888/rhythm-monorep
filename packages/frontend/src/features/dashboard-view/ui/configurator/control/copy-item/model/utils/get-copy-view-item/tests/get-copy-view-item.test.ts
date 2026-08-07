import { ViewItem } from 'entities/dashboard-view';
import { getCopyViewItem } from '..';


describe('getCopyViewItem', () => {
  const items = [
    { id: '1',  order: '1000', parentId: 'no_parentId', oldId: '1', oldParentId: 'no_parentId'  },
    { id: '2',  order: '2000', parentId: 'no_parentId', oldId: '2', oldParentId: 'no_parentId'  },
    { id: '3',  order: '3000', parentId: 'no_parentId', oldId: '3', oldParentId: 'no_parentId'  },
    { id: '4',  order: '1000', parentId: '1',           oldId: '4', oldParentId: '1'            },
    { id: '5',  order: '1000', parentId: '2',           oldId: '5', oldParentId: '2'            },
    { id: '6',  order: '1000', parentId: '3',           oldId: '6', oldParentId: '3'            },
    { id: '7',  order: '2000', parentId: '1',           oldId: '7', oldParentId: '1'            },
    { id: '8',  order: '2000', parentId: '2',           oldId: '8', oldParentId: '2'            },
    { id: '9',  order: '2000', parentId: '3',           oldId: '9', oldParentId: '3'            },
    { id: '10', order: '1000', parentId: '4',           oldId: '10', oldParentId: '4'            },
    { id: '11', order: '2000', parentId: '4',           oldId: '11', oldParentId: '4'            },
    { id: '12', order: '3000', parentId: '4',           oldId: '12', oldParentId: '4'            },
    { id: '13', order: '4000', parentId: 'no_parentId', oldId: '13', oldParentId: 'no_parentId'  },
    { id: '14', order: '5000', parentId: 'no_parentId', oldId: '14', oldParentId: 'no_parentId'  },
    { id: '15', order: '1000', parentId: '12',          oldId: '15', oldParentId: '12'           },
    { id: '16', order: '1000', parentId: '11',          oldId: '16', oldParentId: '11'           },
    { id: '17', order: '6000', parentId: 'no_parentId', oldId: '17', oldParentId: 'no_parentId'  },
    { id: '18', order: '1000', parentId: '15',          oldId: '18', oldParentId: '15'           },
    { id: '19', order: '1000', parentId: '18',          oldId: '19', oldParentId: '18'           },
    { id: '20', order: '2000', parentId: '18',          oldId: '20', oldParentId: '18'           },
  ];

  test('Valid data, coping first item', () => {
    const result = getCopyViewItem({ type: 'copyItemFirstOnly', id: '4' }, 'no_parentId', items as unknown as ViewItem[], 'userId_123');
    // console.log(result);

    const resultOldData = result.map(item => ({
      // @ts-ignore
      oldId: item.oldId, oldParentId : item.oldParentId,
    }));

    expect(result[0].order).toEqual(7000);
    expect(result[0].parentId).toEqual('no_parentId');
    expect(result[0].lastChange.userId).toEqual('userId_123');
    expect(result.length).toEqual(1);

    expect(resultOldData).toEqual([{ oldId: '4',  oldParentId: '1' }]);
  });


  test('Valid data to no_parentId', () => {
    const result = getCopyViewItem({ type: 'copyItemsAll', id: '4' }, 'no_parentId', items as unknown as ViewItem[], 'userId_123');
    // console.log(result);

    const resultOldData = result.map(item => ({
      // @ts-ignore
      oldId: item.oldId, oldParentId : item.oldParentId,
    }));

    expect(result[0].order).toEqual(7000);
    expect(result[0].parentId).toEqual('no_parentId');
    expect(result[1].parentId).toEqual(result[0].id);
    expect(result.length).toEqual(9);
    expect(result[0].lastChange.userId).toEqual('userId_123');


    expect(resultOldData).toEqual([
      { oldId: '4',  oldParentId: '1' },
      { oldId: '10', oldParentId: '4' },
      { oldId: '11', oldParentId: '4' },
      { oldId: '16', oldParentId: '11' },
      { oldId: '12', oldParentId: '4' },
      { oldId: '15', oldParentId: '12' },
      { oldId: '18', oldParentId: '15' },
      { oldId: '19', oldParentId: '18' },
      { oldId: '20', oldParentId: '18' },
    ]);
  });

  test('Valid data to 111', () => {
    const result = getCopyViewItem({ type: 'copyItemsAll', id: '4' }, '111', items as unknown as ViewItem[], 'userId_123');

    const resultOldData = result.map(item => ({
      // @ts-ignore
      oldId: item.oldId, oldParentId : item.oldParentId,
    }));

    expect(result[0].order).toEqual(1000);
    expect(result[0].parentId).toEqual('111');
    expect(result[1].parentId).toEqual(result[0].id);
    expect(result.length).toEqual(9);
    expect(result[0].lastChange.userId).toEqual('userId_123');


    expect(resultOldData).toEqual([
      { oldId: '4',  oldParentId: '1' },
      { oldId: '10', oldParentId: '4' },
      { oldId: '11', oldParentId: '4' },
      { oldId: '16', oldParentId: '11' },
      { oldId: '12', oldParentId: '4' },
      { oldId: '15', oldParentId: '12' },
      { oldId: '18', oldParentId: '15' },
      { oldId: '19', oldParentId: '18' },
      { oldId: '20', oldParentId: '18' },
    ]);
  });


  test('Invalid items', () => {
    const result = getCopyViewItem({ type: 'copyItemsAll', id: '4' }, '111', undefined as unknown as ViewItem[], 'userId_123');

    expect(result).toEqual([]);
  });

  test('Incorrect copiedId', () => {
    const result = getCopyViewItem({ type: 'copyItemsAll', id: '100500' }, '111', items as unknown as ViewItem[], 'userId_123');

    expect(result).toEqual([]);
  });
});

// npm run test:unit get-copy-view-item.test.ts
