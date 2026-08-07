import { DashboardViewEntities } from '../../../slice/state-schema';
import { ViewItem, ViewItemId } from '../../../../types';
import { getFirstItemInBranchWithGlobalKod } from '..';



describe('getFirstItemInBranchWithGlobalKod', () => {
  // Мок данных для entities
  const createEntity = (id: ViewItemId, isGlobalKod: boolean, parentId: ViewItemId = ''): ViewItem => ({
    id,
    settings: { isGlobalKod },
    parentId,
    // другие необходимые поля...
  } as ViewItem);

  it('should return undefined for empty branch', () => {
    const entities: DashboardViewEntities = {};
    const targetId = '1';

    const result = getFirstItemInBranchWithGlobalKod(entities, targetId);
    expect(result).toBeUndefined();
  });

  it('should return undefined if no parents have isGlobalKod', () => {
    const entities: DashboardViewEntities = {
      1: createEntity('1', false),
      2: createEntity('2', false, '1'),
      3: createEntity('3', false, '2'),
    };

    const result = getFirstItemInBranchWithGlobalKod(entities, '3');
    expect(result).toBeUndefined();
  });

  it('should return the first parent with isGlobalKod in branch', () => {
    const globalKodEntity = createEntity('2', true);
    const entities: DashboardViewEntities = {
      1: createEntity('1', false),
      2: globalKodEntity,
      3: createEntity('3', false, '2'),
      4: createEntity('4', false, '3'),
    };

    const result = getFirstItemInBranchWithGlobalKod(entities, '4');
    expect(result).toBe(globalKodEntity);
  });

  it('should return the closest parent with isGlobalKod when multiple exist', () => {
    const firstGlobalKod = createEntity('2', true);
    const secondGlobalKod = createEntity('4', true);
    const entities: DashboardViewEntities = {
      1: createEntity('1', false),
      2: firstGlobalKod,
      3: createEntity('3', false, '2'),
      4: secondGlobalKod,
      5: createEntity('5', false, '4'),
    };

    const result = getFirstItemInBranchWithGlobalKod(entities, '5');
    expect(result).toBe(secondGlobalKod);
  });

  it('should handle circular references without infinite loop', () => {
    const entities: DashboardViewEntities = {
      1: createEntity('1', false, '3'), // circular reference
      2: createEntity('2', true, '1'),
      3: createEntity('3', false, '2'),
    };

    const result = getFirstItemInBranchWithGlobalKod(entities, '3');
    expect(result).toBe(entities['2']);
  });

  it('should return undefined if target entity does not exist', () => {
    const entities: DashboardViewEntities = {
      1: createEntity('1', true),
    };

    const result = getFirstItemInBranchWithGlobalKod(entities, 'non-existent');
    expect(result).toBeUndefined();
  });
});

// npm run test:unit get-first-item-in-branch-with-global-kod.test.ts
