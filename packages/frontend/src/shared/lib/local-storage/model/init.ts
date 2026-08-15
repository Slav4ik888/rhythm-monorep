// packages/frontend/src/shared/lib/local-storage/model/init.ts
// Однократная миграция «тяжёлых» per-company ключей из localStorage в IndexedDB
// и загрузка IndexedDB в синхронный in-memory кеш (HeavyStorage).

import { HeavyStorage } from '../../indexed-db';
import { PREFIX, HEAVY_KEY_PREFIXES } from './main';
import { __devLog } from '../../tests/__dev-log';

/**
 * Переносит существующие «тяжёлые» ключи из localStorage в IndexedDB
 * и удаляет их из localStorage, чтобы освободить квоту (~5 МБ).
 * Безопасна для повторного вызова: ключей в localStorage уже не будет.
 */
export async function migrateHeavyFromLocalStorage(): Promise<void> {
  const entries: Array<[string, unknown]> = [];

  Object.keys(localStorage).forEach((lsKey) => {
    if (!lsKey.startsWith(PREFIX)) return;

    // storageName — ключ без PREFIX (например `dataState-${companyId}`)
    const storageName = lsKey.slice(PREFIX.length);
    const isHeavy = HEAVY_KEY_PREFIXES.some((prefix) => storageName.startsWith(prefix));
    if (!isHeavy) return;

    const raw = localStorage.getItem(lsKey);
    if (raw == null) return;

    try {
      entries.push([storageName, JSON.parse(raw) as unknown]);
      localStorage.removeItem(lsKey);
    } catch (e) {
      __devLog('migrateHeavyFromLocalStorage', `Не удалось мигрировать ${lsKey}`, e);
    }
  });

  if (entries.length) {
    await HeavyStorage.bulkSet(entries);
    __devLog('migrateHeavyFromLocalStorage', `Мигрировано ключей в IndexedDB: ${entries.length}`);
  }
}

/**
 * Инициализация «тяжёлого» хранилища:
 * 1) миграция существующих ключей из localStorage в IndexedDB;
 * 2) загрузка всех данных IndexedDB в in-memory кеш (чтобы синхронные чтения работали).
 * Вызывается один раз на старте приложения (до первого чтения LS.*).
 */
export async function initHeavyStorage(): Promise<void> {
  await migrateHeavyFromLocalStorage();
  await HeavyStorage.hydrate();
  // Включаем кросс-вкладочную синхронизацию (BroadcastChannel): изменения «тяжёлых»
  // ключей из других вкладок будут применяться к in-memory кешу этой вкладки.
  HeavyStorage.startSync();
}
