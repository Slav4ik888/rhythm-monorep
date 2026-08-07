import { DashboardViewEntities } from '../../../slice/state-schema';
import { isFirstGlobalKodInBranch } from '..';


describe('isFirstGlobalKodInBranch', () => {
  const entities = {
    // Корень дерева (не isGlobalKod)
    root: { id: 'root', parentId: null, settings: { isGlobalKod: false } },

    // Элементы с isGlobalKod = true
    global1: { id: 'global1', parentId: 'root', settings: { isGlobalKod: true } },
    global2: { id: 'global2', parentId: 'global1', settings: { isGlobalKod: true } },

    // Обычные элементы (isGlobalKod = false)
    child1: { id: 'child1', parentId: 'global1', settings: { isGlobalKod: false } },
    child2: { id: 'child2', parentId: 'child1', settings: { isGlobalKod: false } },
    child3: { id: 'child3', parentId: 'global2', settings: { isGlobalKod: false } },

    // Элемент без родителя (сирота)
    orphan: { id: 'orphan', parentId: 'nonexistent', settings: { isGlobalKod: true } },
  } as unknown as DashboardViewEntities;

  //= == Позитивные тесты ===//
  it('возвращает true, если targetId - первый isGlobalKod в ветке selectedId', () => {
    // Ветка для child2: ['global1', 'root']
    expect(isFirstGlobalKodInBranch(entities, 'child2', 'global1')).toBe(true);
  });

  it('возвращает false, если targetId не первый isGlobalKod в ветке', () => {
    // Ветка для child3: ['global2', 'global1', 'root']
    // global2 идёт раньше global1, поэтому global1 не является первым
    expect(isFirstGlobalKodInBranch(entities, 'child3', 'global1')).toBe(false);
  });

  //= == Граничные случаи ===//
  it('возвращает false, если у selectedId нет isGlobalKod в ветке', () => {
    // Ветка для child1: ['global1', 'root'] → isGlobalKod есть, но проверяем неверный targetId
    expect(isFirstGlobalKodInBranch(entities, 'child1', 'root')).toBe(false);
  });

  it('возвращает false для корневого элемента (у него нет родителей)', () => {
    expect(isFirstGlobalKodInBranch(entities, 'root', 'root')).toBe(false);
  });

  it('возвращает false для элемента без родителей (сироты)', () => {
    expect(isFirstGlobalKodInBranch(entities, 'orphan', 'orphan')).toBe(false);
  });

  //= == Обработка ошибок ===//
  it('возвращает false при несуществующем selectedId', () => {
    expect(isFirstGlobalKodInBranch(entities, 'nonexistent', 'global1')).toBe(false);
  });

  it('возвращает false при несуществующем targetId', () => {
    expect(isFirstGlobalKodInBranch(entities, 'child1', 'nonexistent')).toBe(false);
  });

  //= == Специальные случаи ===//
  it('возвращает true, если targetId - единственный isGlobalKod в ветке', () => {
    const localEntities = {
      ...entities,
      onlyGlobal: { id: 'onlyGlobal', parentId: 'root', settings: { isGlobalKod: true } },
      deepChild: { id: 'deepChild', parentId: 'onlyGlobal', settings: { isGlobalKod: false } },
    } as unknown as DashboardViewEntities;
    // Ветка для deepChild: ['onlyGlobal', 'root']
    expect(isFirstGlobalKodInBranch(localEntities, 'deepChild', 'onlyGlobal')).toBe(true);
  });
});

// npm run test:unit is-first-global-kod-in-branch.test.ts
