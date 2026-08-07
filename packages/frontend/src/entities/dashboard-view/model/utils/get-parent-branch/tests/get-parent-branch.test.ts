import { DashboardViewEntities } from '../../../slice/state-schema';
import { getParentBranch } from '..';



describe('getParentBranch', () => {
  // Мок данных (хэш-таблица entities)
  const entities = {
    1: { id: '1', parentId: '' }, // Корень
    2: { id: '2', parentId: '1' },
    3: { id: '3', parentId: '1' },
    4: { id: '4', parentId: '2' },
    5: { id: '5', parentId: '2' },
    6: { id: '6', parentId: '3' },
    7: { id: '7', parentId: '4' },
    8: { id: '8', parentId: 'x' }, // Несуществующий parentId'
    9: { id: '9', parentId: '8' },
  } as unknown as DashboardViewEntities;

  it('возвращает пустой массив для корневого элемента', () => {
    expect(getParentBranch(entities, '1')).toEqual([]);
  });

  it('возвращает родительскую ветку для элемента с одним родителем', () => {
    expect(getParentBranch(entities, '2')).toEqual(['1']);
  });

  it('возвращает упорядоченную ветку для элемента с несколькими родителями', () => {
    expect(getParentBranch(entities, '7')).toEqual(['4', '2', '1']);
  });

  it('возвращает упорядоченную ветку для элемента где по пути есть несуществующий parentId = "x"', () => {
    expect(getParentBranch(entities, '9')).toEqual(['8']);
  });

  it('возвращает пустой массив для несуществующего элемента', () => {
    expect(getParentBranch(entities, '999')).toEqual([]);
  });

  it('корректно обрабатывает циклическую зависимость (не зависает)', () => {
    const cyclicEntities = {
      A: { id: 'A', parentId: 'B' },
      B: { id: 'B', parentId: 'A' }, // A → B → A → ...
    } as unknown as DashboardViewEntities;
    expect(getParentBranch(cyclicEntities, 'A')).toEqual(['B',  'A']);
    // Или можно ожидать, что функция остановится после первого цикла
  });

  it('возвращает пустой массив, если entities пуст', () => {
    expect(getParentBranch({}, '1')).toEqual([]);
  });

  it('возвращает пустой массив, если targetId === null', () => {
    // @ts-ignore
    expect(getParentBranch(entities, null)).toEqual([]);
  });
});

// npm run test:unit get-parent-branch.test.ts
