// packages/frontend/src/shared/lib/indexed-db/storage.ts
// Синхронный фасад над IndexedDB для «тяжёлых» per-company данных.
//
// IndexedDB имеет async API, а «тяжёлые» ключи (bunches, dataState, ...) читаются
// в синхронных местах: внутри Zustand-сторов (set-колбэки), useMemo и getInitialState.
// Чтобы не размазывать async по всему приложению, держим in-memory кеш:
//   - чтение — мгновенное, из памяти (как раньше из localStorage);
//   - запись — в память + асинхронно в IndexedDB (очередь сохраняет порядок).
// Перед первым использованием нужно один раз вызвать hydrate() на старте приложения.

import { getDb, STORE_NAME } from './db';
import { __devLog } from '../tests/__dev-log';

// Синхронный in-memory кеш (ключ → значение).
const memory = new Map<string, unknown>();

// Очередь записи в IndexedDB: гарантирует порядок операций и не роняет приложение.
let writeQueue: Promise<void> = Promise.resolve();

function enqueue<T>(op: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(op);
  writeQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

export const HeavyStorage = {
  /** Синхронное чтение из памяти. Возвращает undefined, если ключа нет. */
  get<T>(key: string): T | undefined {
    return memory.get(key) as T | undefined;
  },

  /** Синхронная запись в память + отложенная запись в IndexedDB. */
  set<T>(key: string, value: T): void {
    memory.set(key, value);
    enqueue(() => getDb().then((db) => db.put(STORE_NAME, value, key))).catch((e) => __devLog('HeavyStorage.set', e));
  },

  has(key: string): boolean {
    return memory.has(key);
  },

  /** Синхронное удаление из памяти + отложенное удаление из IndexedDB. */
  remove(key: string): void {
    memory.delete(key);
    enqueue(() => getDb().then((db) => db.delete(STORE_NAME, key))).catch((e) => __devLog('HeavyStorage.remove', e));
  },

  /** Массовая запись одной транзакцией (используется при миграции из localStorage). */
  async bulkSet(entries: Array<[string, unknown]>): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await Promise.all(
      entries.map(([key, value]) => {
        memory.set(key, value);
        return tx.store.put(value, key);
      }),
    );
    await tx.done;
  },

  /** Дождаться завершения всех отложенных записей (для тестов/миграции). */
  async flush(): Promise<void> {
    await writeQueue;
  },

  /** Загрузить все данные из IndexedDB в память. Вызывается один раз при старте. */
  async hydrate(): Promise<void> {
    await writeQueue;
    const db = await getDb();
    const keys = (await db.getAllKeys(STORE_NAME)) as string[];
    await Promise.all(
      keys.map(async (key) => {
        const value = await db.get(STORE_NAME, key);
        memory.set(key, value);
      }),
    );
  },

  /** Полностью очистить хранилище (память + IndexedDB). */
  async clear(): Promise<void> {
    memory.clear();
    await writeQueue;
    const db = await getDb();
    await db.clear(STORE_NAME);
  },
};
