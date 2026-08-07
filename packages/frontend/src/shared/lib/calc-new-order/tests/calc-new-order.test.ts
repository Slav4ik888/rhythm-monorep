import { calcNewOrder } from '..';


describe('calcNewOrder', () => {
  const items = [
    { id: '1', order: 1000 },
    { id: '2', order: 2000 },
    { id: '3', order: 3000 },
    { id: '4', order: 4000 },
    { id: '5', order: 5000 },
    { id: '6', order: 6000 },
    { id: '7', order: 7000 },
  ];

  test('UP, current item is first', () => {
    expect(calcNewOrder('up', items, items[0])).toEqual(8000);
  });
  test('UP, current item is second', () => {
    expect(calcNewOrder('up', items, items[1])).toEqual(500);
  });
  test('UP, current item is third', () => {
    expect(calcNewOrder('up', items, items[2])).toEqual(1500);
  });
  test('UP, current item is fourth', () => {
    expect(calcNewOrder('up', items, items[3])).toEqual(2500);
  });

  test('DOWN, current item is last', () => {
    expect(calcNewOrder('down', items, items[6])).toEqual(500);
  });
  test('DOWN, current item is prevLast', () => {
    expect(calcNewOrder('down', items, items[5])).toEqual(8000);
  });
  test('DOWN, current item is third', () => {
    expect(calcNewOrder('down', items, items[4])).toEqual(6500);
  });
  test('DOWN, current item is fourth', () => {
    expect(calcNewOrder('down', items, items[3])).toEqual(5500);
  });

  const itemsWithDoubleOrder = [
    { id: '1', order: 1000 },
    { id: '2', order: 1000 },
    { id: '3', order: 3000 },
    { id: '4', order: 4000 },
    { id: '5', order: 5000 },
    { id: '6', order: 6000 },
    { id: '7', order: 7000 },
  ];
  test('Double order, UP, current item is second with double order', () => {
    expect(calcNewOrder('up', itemsWithDoubleOrder, itemsWithDoubleOrder[1])).toEqual(500);
  });
  test('Double order, DOWN, current item is first with double order', () => {
    expect(calcNewOrder('down', itemsWithDoubleOrder, itemsWithDoubleOrder[0])).toEqual(2000);
  });
});

// npm run test:unit calc-new-order.test.ts
