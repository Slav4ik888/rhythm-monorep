import { ViewItem } from '../../../../types';
import { createNextOrder } from '..';


describe('createNextOrder', () => {
  test('data is valid', () => {
    const children = [
      { order: 1000 },
      { order: 2000 },
      { order: 30000 }
    ];

    expect(createNextOrder(children)).toEqual(31000);
  });

  test('data is undefined', () => {
    expect(createNextOrder(undefined as unknown as ViewItem[])).toEqual(1000);
  });
});

// npm run test:unit create-next-order.test.ts
