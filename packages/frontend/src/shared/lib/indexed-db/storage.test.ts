// packages/frontend/src/shared/lib/indexed-db/storage.test.ts
// Unit-тесты синхронного фасада HeavyStorage (in-memory кеш + IndexedDB).

import { HeavyStorage } from './storage';
import { resetDbForTests } from './db';
import { openDB } from 'idb';

// Мокаем idb: jsdom не реализует IndexedDB, а нам нужно проверить именно логику фасада.
jest.mock('idb', () => ({
  openDB: jest.fn(),
}));

const fakeStore = new Map<string, unknown>();

const fakeDb = {
  get: jest.fn(async (_store: string, key: string) => fakeStore.get(key)),
  getAllKeys: jest.fn(async (_store: string) => Array.from(fakeStore.keys())),
  put: jest.fn(async (_store: string, value: unknown, key: string) => {
    fakeStore.set(key, value);
    return key;
  }),
  delete: jest.fn(async (_store: string, key: string) => {
    fakeStore.delete(key);
  }),
  clear: jest.fn(async (_store: string) => {
    fakeStore.clear();
  }),
  transaction: jest.fn(() => ({
    store: {
      put: jest.fn(async (value: unknown, key: string) => {
        fakeStore.set(key, value);
        return key;
      }),
    },
    done: Promise.resolve(),
  })),
};

const openDBMock = openDB as jest.Mock;

describe('HeavyStorage (IndexedDB)', () => {
  beforeEach(async () => {
    fakeStore.clear();
    openDBMock.mockResolvedValue(fakeDb);
    resetDbForTests();
    await HeavyStorage.clear();
  });

  it('set + get: данные пишутся и читаются синхронно из памяти', () => {
    HeavyStorage.set('bunches-comp-1', { a: 1 });
    expect(HeavyStorage.get('bunches-comp-1')).toEqual({ a: 1 });
    expect(HeavyStorage.has('bunches-comp-1')).toBe(true);
  });

  it('get возвращает undefined для отсутствующего ключа', () => {
    expect(HeavyStorage.get('missing')).toBeUndefined();
    expect(HeavyStorage.has('missing')).toBe(false);
  });

  it('set персистит данные в IndexedDB (после flush)', async () => {
    HeavyStorage.set('dataState-comp-1', { x: 42 });
    await HeavyStorage.flush();
    expect(fakeDb.put).toHaveBeenCalledWith('kv', { x: 42 }, 'dataState-comp-1');
    expect(fakeStore.get('dataState-comp-1')).toEqual({ x: 42 });
  });

  it('hydrate загружает данные из IndexedDB в память', async () => {
    fakeStore.set('bunches-comp-2', { b: 2 });
    await HeavyStorage.hydrate();
    expect(HeavyStorage.get('bunches-comp-2')).toEqual({ b: 2 });
  });

  it('bulkSet записывает несколько ключей одной транзакцией', async () => {
    await HeavyStorage.bulkSet([
      ['a', 1],
      ['b', 2],
    ]);
    expect(HeavyStorage.get('a')).toBe(1);
    expect(HeavyStorage.get('b')).toBe(2);
    expect(fakeStore.get('a')).toBe(1);
    expect(fakeStore.get('b')).toBe(2);
  });

  it('remove удаляет ключ из памяти и IndexedDB', async () => {
    HeavyStorage.set('k', 'v');
    await HeavyStorage.flush();
    HeavyStorage.remove('k');
    await HeavyStorage.flush();
    expect(HeavyStorage.get('k')).toBeUndefined();
    expect(fakeStore.has('k')).toBe(false);
  });

  it('clear очищает и память, и IndexedDB', async () => {
    HeavyStorage.set('k', 'v');
    await HeavyStorage.flush();
    await HeavyStorage.clear();
    expect(HeavyStorage.get('k')).toBeUndefined();
    expect(fakeStore.size).toBe(0);
  });
});
