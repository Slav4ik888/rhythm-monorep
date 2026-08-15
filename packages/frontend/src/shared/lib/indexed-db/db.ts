// packages/frontend/src/shared/lib/indexed-db/db.ts
// Низкоуровневый доступ к IndexedDB через обёртку idb.
// База хранит «тяжёлые» per-company данные дашборда, вынесенные из localStorage
// (квота localStorage ~5 МБ исчерпывалась при загрузке данных нескольких компаний).

import { openDB, type IDBPDatabase } from 'idb';

export const DB_NAME = 'rhythm-heavy-data';
export const DB_VERSION = 1;
export const STORE_NAME = 'kv';

let dbPromise: Promise<IDBPDatabase> | null = null;

/** Открывает (лениво) БД один раз и переиспользует соединение. */
export function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    }).catch((e) => {
      // Не кешируем «битое» соединение — даём возможность повторить позже.
      dbPromise = null;
      throw e;
    });
  }
  return dbPromise;
}

/** Только для тестов: сбрасывает закешированное соединение. */
export function resetDbForTests(): void {
  dbPromise = null;
}
