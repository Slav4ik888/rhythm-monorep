// packages/backend/src/models/dashboard-view/utils/tests/filter-view-item.test.ts

import { filterViewItem, filterViewItems } from '../filter-view-item';

describe('filterViewItem', () => {
  it('убирает createdAt и lastChange', () => {
    const item = {
      id: 'v1',
      bunchId: 'b1',
      type: 'box',
      createdAt: { userId: 'x', date: 1 },
      lastChange: { userId: 'x', date: 1 },
    };

    const result = filterViewItem(item as never);

    expect(result).not.toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('lastChange');
    expect(result.id).toBe('v1');
    expect(result.bunchId).toBe('b1');
  });

  it('filterViewItems применяет к массиву', () => {
    const items = [{ id: 'v1', createdAt: { userId: 'x', date: 1 } }];
    const result = filterViewItems(items as never);
    expect(result[0]).not.toHaveProperty('createdAt');
  });
});
