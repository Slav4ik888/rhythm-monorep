// packages/frontend/src/shared/lib/indexed-db/storage.test.ts
// Unit-тесты синхронного фасада HeavyStorage (in-memory кеш + IndexedDB).

import { HeavyStorage } from './storage';
import { resetDbForTests } from './db';
import { resetHeavySyncForTests } from './broadcast';
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

/**
 * Минимальный fake BroadcastChannel: jsdom его не реализует.
 * Не доставляет сообщение вкладке-отправителю (как и настоящий), поэтому в тестах
 * «доставку из другой вкладки» эмулируем вручную через метод emit().
 */
class FakeBroadcastChannel {
  static instances: FakeBroadcastChannel[] = [];

  listeners: Array<(event: { data: unknown }) => void> = [];

  posted: unknown[] = [];

  constructor() {
    FakeBroadcastChannel.instances.push(this);
  }

  postMessage(message: unknown) {
    this.posted.push(message);
  }

  addEventListener(type: string, listener: (event: { data: unknown }) => void) {
    if (type === 'message') this.listeners.push(listener);
  }

  removeEventListener(type: string, listener: (event: { data: unknown }) => void) {
    if (type === 'message') this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // eslint-disable-next-line class-methods-use-this
  close() {
    // noop — канал не держит ресурсы в тестах
  }

  emit(message: unknown) {
    this.listeners.forEach((l) => l({ data: message }));
  }
}

describe('HeavyStorage (IndexedDB)', () => {
  beforeEach(async () => {
    fakeStore.clear();
    openDBMock.mockResolvedValue(fakeDb);
    resetDbForTests();
    resetHeavySyncForTests();
    HeavyStorage.stopSync();
    Object.assign(globalThis, { BroadcastChannel: FakeBroadcastChannel });
    FakeBroadcastChannel.instances = [];
    await HeavyStorage.clear();
    // Сбрасываем канал и историю сообщений после clear, чтобы каждый тест стартовал с чистого листа.
    FakeBroadcastChannel.instances = [];
    resetHeavySyncForTests();
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

  it('set транслирует изменение другим вкладкам через BroadcastChannel', () => {
    HeavyStorage.set('viewBunchesUpdated-comp-1', { b: 1 });
    expect(FakeBroadcastChannel.instances).toHaveLength(1);
    expect(FakeBroadcastChannel.instances[0].posted).toEqual([
      { type: 'set', key: 'viewBunchesUpdated-comp-1', value: { b: 1 } },
    ]);
  });

  it('remove транслирует удаление другим вкладкам через BroadcastChannel', () => {
    HeavyStorage.remove('bunches-comp-1');
    expect(FakeBroadcastChannel.instances[0].posted).toEqual([{ type: 'remove', key: 'bunches-comp-1' }]);
  });

  it('startSync: set из другой вкладки обновляет in-memory кеш и диспатчит storage-событие', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    HeavyStorage.startSync();
    FakeBroadcastChannel.instances[0].emit({ type: 'set', key: 'bunches-comp-1', value: { items: true } });

    expect(HeavyStorage.get('bunches-comp-1')).toEqual({ items: true });
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'storage' }));
  });

  it('startSync: remove из другой вкладки удаляет ключ из in-memory кеша', () => {
    HeavyStorage.set('k', 'v');
    HeavyStorage.startSync();
    FakeBroadcastChannel.instances[0].emit({ type: 'remove', key: 'k' });
    expect(HeavyStorage.get('k')).toBeUndefined();
  });

  it('startSync: clear из другой вкладки очищает in-memory кеш', () => {
    HeavyStorage.set('a', 1);
    HeavyStorage.set('b', 2);
    HeavyStorage.startSync();
    FakeBroadcastChannel.instances[0].emit({ type: 'clear' });
    expect(HeavyStorage.get('a')).toBeUndefined();
    expect(HeavyStorage.get('b')).toBeUndefined();
  });

  it('startSync идемпотентен: повторный вызов не дублирует подписку', () => {
    HeavyStorage.startSync();
    HeavyStorage.startSync();
    // Канал один, и слушатель в нём один (повторный startSync не добавил второй).
    expect(FakeBroadcastChannel.instances).toHaveLength(1);
    expect(FakeBroadcastChannel.instances[0].listeners).toHaveLength(1);
  });
});
