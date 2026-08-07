/* eslint-disable quote-props */
import { ViewItem } from '../../../../types';
import { isClickInsideViewItem } from '..';
import { NO_PARENT_ID } from '../../../../consts';
import { DashboardViewEntities } from '../../../slice/state-schema';



describe('isClickInsideViewItem', () => {
  const mockEntities = {
    'root': { parentId: null },       // Корневой элемент
    '1':    { parentId: 'root' },     // Потомок root
    '1-1':  { parentId: '1' },        // Потомок 1
    '1-2':  { parentId: '1' },        // Потомок 1
    '1-2-1': { parentId: '1-2' },     // Потомок 1-2
    '2':    { parentId: 'root' },     // Другой потомок root
    'orphan': { parentId: 'missing' } // Элемент с несуществующим parentId
  } as unknown as DashboardViewEntities;

  it('should return true if activatedMovementId is a parent of target', () => {
    // '1' — родитель '1-2-1' (цепочка: '1-2-1' → '1-2' → '1' → 'root')
    expect(isClickInsideViewItem(mockEntities, '1', '1-2-1')).toBe(true);
  });

  it('should return false if activatedMovementId is not a parent', () => {
    // '2' не является родителем '1-2-1'
    expect(isClickInsideViewItem(mockEntities, '2', '1-2-1')).toBe(false);
  });

  it('should return false for root element (no parents)', () => {
    expect(isClickInsideViewItem(mockEntities, 'root', 'root')).toBe(false);
  });

  it('should return false if target is orphaned (broken parent link)', () => {
    expect(isClickInsideViewItem(mockEntities, 'root', 'orphan')).toBe(false);
  });

  it('should return false if activatedMovementId === targetId', () => {
    // Элемент не считается своим же родителем
    expect(isClickInsideViewItem(mockEntities, '1-2-1', '1-2-1')).toBe(false);
  });

  it('should handle cyclic dependencies safely', () => {
    const cyclicEntities: DashboardViewEntities = {
      'A': { parentId: 'B' },
      'B': { parentId: 'A' }
    } as unknown as DashboardViewEntities;
    // A → B → A (цикл) — функция должна оборвать поиск
    expect(isClickInsideViewItem(cyclicEntities, 'A', 'B')).toBe(true);
    expect(isClickInsideViewItem(cyclicEntities, 'B', 'A')).toBe(true);
  });
});

// npm run test:unit is-click-inside-view-item.test.ts
