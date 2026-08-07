/* eslint-disable quote-props */
import { Entities, Item, updateEntities, PartialItem } from '..';


describe('updateEntities', () => {
  const initialEntities: Entities<Item> = {
    '1': { id: '1', name: 'Item 1', count: 10 },
    '2': { id: '2', name: 'Item 2', count: 20 },
  };

  it('should add new entities to the object', () => {
    const newItems: Item[] = [
      { id: '3', name: 'Item 3' },
      { id: '4', name: 'Item 4' },
    ];

    const result = updateEntities(initialEntities, newItems);
    expect(result).toEqual({
      '1': { id: '1', name: 'Item 1', count: 10 },
      '2': { id: '2', name: 'Item 2', count: 20 },
      '3': { id: '3', name: 'Item 3' },
      '4': { id: '4', name: 'Item 4' },
    });
  });

  it('should overwrite existing entities if ids match', () => {
    const updatedItems: Item[] = [
      { id: '1', name: 'Updated Item 1' }, // Перезапишет '1'
      { id: '3', name: 'Item 3' },         // Добавит новый
    ];

    const result = updateEntities(initialEntities, updatedItems);
    expect(result).toEqual({
      '1': { id: '1', name: 'Updated Item 1', count: 10 }, // Обновлено!
      '2': { id: '2', name: 'Item 2', count: 20 },
      '3': { id: '3', name: 'Item 3' },
    });
  });

  it('should return the same object if payload is empty', () => {
    const result = updateEntities(initialEntities, []);
    expect(result).toEqual(initialEntities); // Возвращает исходный объект
  });

  it('should handle empty initial entities', () => {
    const newItems: Item[] = [
      { id: '1', name: 'Item 1' },
    ];

    const result = updateEntities({}, newItems);
    expect(result).toEqual({
      '1': { id: '1', name: 'Item 1' },
    });
  });

  it('should work with custom Item types', () => {
    type Book = { id: string; title: string };
    const books: Entities<Book> = {
      'b1': { id: 'b1', title: 'Book 1' },
    };

    const newBooks: Book[] = [
      { id: 'b2', title: 'Book 2' },
    ];

    const result = updateEntities(books, newBooks);
    expect(result).toEqual({
      'b1': { id: 'b1', title: 'Book 1' },
      'b2': { id: 'b2', title: 'Book 2' },
    });
  });



  it('should add new entities and merge partial updates', () => {
    const payload: PartialItem[] = [
      { id: '3', name: 'Item 3' },          // Новый элемент
      { id: '1', count: 100 },              // Обновление count у существующего
    ];

    const result = updateEntities(initialEntities, payload);
    expect(result).toEqual({
      '1': { id: '1', name: 'Item 1', count: 100 }, // count обновлён
      '2': { id: '2', name: 'Item 2', count: 20 },
      '3': { id: '3', name: 'Item 3' },             // Добавлен новый
    });
  });

  it('should ignore items without id', () => {
    const payload: PartialItem[] = [
      // @ts-ignore
      { name: 'No ID' }, // Без id → игнорируется
      { id: '2', name: 'Updated Item 2' },
    ];

    const result = updateEntities(initialEntities, payload);
    expect(result).toEqual({
      '1': { id: '1', name: 'Item 1', count: 10 },
      '2': { id: '2', name: 'Updated Item 2', count: 20 }, // name обновлён
    });
  });

  it('should work with empty initial entities', () => {
    const result = updateEntities({}, [{ id: '1', name: 'New Item' }]);
    expect(result).toEqual({ '1': { id: '1', name: 'New Item' } });
  });
});

// npm run test:unit update-entities.test.ts
