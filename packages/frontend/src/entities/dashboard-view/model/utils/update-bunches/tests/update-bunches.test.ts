import { ViewItem, BunchesViewItem, PartialBunchesViewItem } from '../../../../types';
import { updateBunches } from '..';
import { PartialViewItemUpdate } from 'shared/api/features/dashboard-view';


describe('updateBunches', () => {
  const initialBunches: BunchesViewItem = {
    bunch1: {
      item1: { id: 'item1', name: 'Item 1' } as unknown as ViewItem,
      item2: { id: 'item2', name: 'Item 2' } as unknown as ViewItem,
    },
    bunch2: {
      item3: { id: 'item3', name: 'Item 3' } as unknown as ViewItem,
    },
  };

  it('should merge changedBunches into lastBunches', () => {
    const changes: BunchesViewItem = {
      bunch1: {
        item1: { id: 'item1', name: 'Updated Item 1' } as unknown as ViewItem,
        item4: { id: 'item4', name: 'New Item 4' } as unknown as ViewItem,
      },
      bunch3: {
        item5: { id: 'item5', name: 'Item 5' } as unknown as ViewItem,
      },
    };

    const result = updateBunches(initialBunches, changes);
    expect(result).toEqual({
      bunch1: {
        item1: { id: 'item1', name: 'Updated Item 1' },
        item2: { id: 'item2', name: 'Item 2' },
        item4: { id: 'item4', name: 'New Item 4' },
      },
      bunch2: {
        item3: { id: 'item3', name: 'Item 3' },
      },
      bunch3: {
        item5: { id: 'item5', name: 'Item 5' },
      },
    });
  });

  it('should return changedBunches when lastBunches is null/undefined', () => {
    const changes: BunchesViewItem = {
      bunch1: {
        item1: { id: 'item1', name: 'Item 1' } as unknown as ViewItem,
      },
    };

    expect(updateBunches(null as any, changes)).toEqual(changes);
    expect(updateBunches(undefined as any, changes)).toEqual(changes);
  });

  it('should return lastBunches when changedBunches is null/undefined', () => {
    expect(updateBunches(initialBunches, null as any)).toEqual(initialBunches);
    expect(updateBunches(initialBunches, undefined as any)).toEqual(initialBunches);
  });

  it('should return empty object when both inputs are null/undefined', () => {
    expect(updateBunches(null as any, null as any)).toEqual({});
    expect(updateBunches(undefined as any, undefined as any)).toEqual({});
  });

  it('should not mutate original objects', () => {
    const changes: BunchesViewItem = {
      bunch1: {
        item1: { id: 'item1', name: 'Updated Item' } as unknown as ViewItem,
      },
    };

    const lastBunchesCopy = JSON.parse(JSON.stringify(initialBunches));
    const changesCopy = JSON.parse(JSON.stringify(changes));

    const result = updateBunches(initialBunches, changes);

    expect(initialBunches).toEqual(lastBunchesCopy);
    expect(changes).toEqual(changesCopy);
    expect(result).not.toBe(initialBunches);
    expect(result).not.toBe(changes);
  });

  it('should handle empty bunches', () => {
    const emptyChanges: BunchesViewItem = {};
    const result = updateBunches(initialBunches, emptyChanges);
    expect(result).toEqual(initialBunches);
  });

  it('should preserve unchanged items in updated bunches', () => {
    const changes: BunchesViewItem = {
      bunch1: {
        item1: { id: 'item1', name: 'Updated Item 1' } as unknown as ViewItem,
      },
    };

    const result = updateBunches(initialBunches, changes);
    expect(result.bunch1.item2).toEqual(initialBunches.bunch1.item2);
  });

  it('should add completely new bunches', () => {
    const newBunch: BunchesViewItem = {
      newBunch: {
        newItem: { id: 'newItem', name: 'New Item' } as unknown as ViewItem,
      },
    };

    const result = updateBunches(initialBunches, newBunch);
    expect(result.newBunch).toEqual(newBunch.newBunch);
    expect(result.bunch1).toEqual(initialBunches.bunch1); // Проверяем что старые данные остались
  });

  it('should handle deep updates without removing existing properties', () => {
    const complexInitial: BunchesViewItem = {
      bunch1: {
        item1: { id: 'item1', name: 'Item 1', extra: { prop1: 'value1' } } as unknown as ViewItem,
      },
    };

    const changes: BunchesViewItem = {
      bunch1: {
        item1: { id: 'item1', name: 'Updated Item 1', extra: { prop2: 'value2' } } as unknown as ViewItem,
      },
    };

    const result = updateBunches(complexInitial, changes);
    expect(result.bunch1.item1).toEqual({
      id: 'item1',
      name: 'Updated Item 1',
      extra: { prop1: 'value1', prop2: 'value2' }, // Проверяем глубокое мержирование
    });
  });
});



describe('updateBunches with PartialViewItem types', () => {
  const initialBunches: BunchesViewItem = {
    bunch1: {
      item1: {
        id: 'item1',
        bunchId: 'bunch1',
        name: 'Item 1',
        description: 'Description 1',
        meta: {
          version: 1,
          tags: ['a', 'b'],
          nested: { a: 1, b: 2 }
        }
      } as unknown as ViewItem,
      item2: {
        id: 'item2',
        bunchId: 'bunch1',
        name: 'Item 2',
        meta: { version: 1 }
      } as unknown as ViewItem,
    },
    bunch2: {
      item3: {
        id: 'item3',
        bunchId: 'bunch2',
        name: 'Item 3',
        meta: { version: 1 }
      } as unknown as ViewItem,
    },
  };

  it('should handle PartialViewItem with only id and bunchId', () => {
    const changes: PartialBunchesViewItem = {
      bunch1: {
        item1: {
          id: 'item1',
          bunchId: 'bunch1' // Только обязательные поля
        } as PartialViewItemUpdate
      }
    };

    const result = updateBunches(initialBunches, changes);
    // @ts-ignore
    expect(result.bunch1.item1.name).toBe('Item 1'); // Сохранилось старое значение
    expect(result.bunch1.item1.description).toBe('Description 1');
  });

  it('should update fields in PartialViewItem without losing others', () => {
    const changes: PartialBunchesViewItem = {
      bunch1: {
        item1: {
          id: 'item1',
          bunchId: 'bunch1',
          name: 'Updated Name' // Только одно поле обновлено
        } as PartialViewItemUpdate
      }
    };

    const result = updateBunches(initialBunches, changes);
    // @ts-ignore
    expect(result.bunch1.item1.name).toBe('Updated Name');
    expect(result.bunch1.item1.description).toBe('Description 1'); // Сохранилось
    // @ts-ignore
    expect(result.bunch1.item1.meta).toEqual(initialBunches.bunch1.item1.meta);
  });

  it('should handle nested partial updates in meta', () => {
    const changes: PartialBunchesViewItem = {
      bunch1: {
        item1: {
          id: 'item1',
          bunchId: 'bunch1',
          meta: {
            version: 2, // Обновляем version
            nested: { a: 3 } // Частичное обновление nested
          }
        } as PartialViewItemUpdate
      }
    };

    const result = updateBunches(initialBunches, changes);
    // @ts-ignore
    expect(result.bunch1.item1.meta.version).toBe(2);
    // @ts-ignore
    expect(result.bunch1.item1.meta.nested.a).toBe(3);
    // @ts-ignore
    expect(result.bunch1.item1.meta.nested.b).toBe(2); // Сохранилось
    // @ts-ignore
    expect(result.bunch1.item1.meta.tags).toEqual(['a', 'b']); // Сохранилось
  });

  it('should add new items with PartialViewItem', () => {
    const changes: PartialBunchesViewItem = {
      bunch1: {
        newItem: {
          id: 'newItem',
          bunchId: 'bunch1',
          name: 'New Item'
        } as PartialViewItemUpdate
      }
    };

    const result = updateBunches(initialBunches, changes);
    expect(result.bunch1.newItem).toEqual({
      id: 'newItem',
      bunchId: 'bunch1',
      name: 'New Item'
    });
    expect(result.bunch1.item1).toEqual(initialBunches.bunch1.item1); // Старые данные на месте
  });

  it('should handle empty PartialViewItem updates', () => {
    const changes: PartialBunchesViewItem = {
      bunch1: {
        item1: {
          id: 'item1',
          bunchId: 'bunch1'
        } as PartialViewItemUpdate // Никаких изменений
      }
    };

    const result = updateBunches(initialBunches, changes);
    expect(result.bunch1.item1).toEqual(initialBunches.bunch1.item1);
  });

  it('should handle undefined fields in PartialViewItem', () => {
    const changes: PartialBunchesViewItem = {
      bunch1: {
        item1: {
          id: 'item1',
          bunchId: 'bunch1',
          name: undefined // Явное undefined
        } as PartialViewItemUpdate
      }
    };

    const result = updateBunches(initialBunches, changes);
    // @ts-ignore
    expect(result.bunch1.item1.name).toBeUndefined();
    expect(result.bunch1.item1.description).toBe('Description 1'); // Сохранилось
  });

  it('should handle complex nested structures in PartialViewItem', () => {
    const changes: PartialBunchesViewItem = {
      bunch1: {
        item1: {
          id: 'item1',
          bunchId: 'bunch1',
          meta: {
            tags: ['c'], // Полная замена массива
            nested: { b: undefined } // Удаление поля
          }
        } as PartialViewItemUpdate
      }
    };

    const result = updateBunches(initialBunches, changes);
    // @ts-ignore
    expect(result.bunch1.item1.meta.tags).toEqual(['c']);
    // @ts-ignore
    expect(result.bunch1.item1.meta.nested).toEqual({ a: 1 });
    // @ts-ignore
    expect(result.bunch1.item1.meta.version).toBe(1); // Сохранилось
  });


  it('should deeply merge nested objects when updateObject supports it', () => {
  // Предполагаем что updateObject делает глубокий мерж
  const changes: PartialBunchesViewItem = {
    bunch1: {
      item1: {
        id: 'item1',
        bunchId: 'bunch1',
        meta: {
          version: 2,
          newProp: 'value'
        }
      } as PartialViewItemUpdate,
    },
  };

  const result = updateBunches(initialBunches, changes);
    // @ts-ignore
  expect(result.bunch1.item1.meta).toEqual({
    version: 2,
    tags: ['a', 'b'],
    nested: { a: 1, b: 2 },
    newProp: 'value'
  });
});
});

// npm run test:unit update-bunches.test.ts
