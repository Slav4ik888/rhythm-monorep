// packages/frontend/src/shared/lib/indexed-db/broadcast.ts
// Кросс-вкладочная синхронизация «тяжёлых» данных (IndexedDB).
//
// IndexedDB не генерирует localStorage-событие `storage`, поэтому после выноса
// «тяжёлых» ключей (bunches, dataState, viewBunchesUpdated, ...) в IndexedDB
// другие вкладки перестали получать уведомления об изменениях. BroadcastChannel
// закрывает этот пробел: каждая запись/удаление/очистка транслируется остальным
// вкладкам, и те обновляют свой синхронный in-memory кеш (HeavyStorage).
//
// Примечание: BroadcastChannel НЕ доставляет сообщение вкладке-отправителю,
// поэтому same-tab синхронизация остаётся на ручном
// `window.dispatchEvent(new Event('storage'))` в local-storage/model/helpers.ts.

import { __devLog } from '../tests/__dev-log';

export const HEAVY_SYNC_CHANNEL = 'rhythm-heavy-data-sync';

export type HeavySyncMessage =
  { type: 'set'; key: string; value: unknown } | { type: 'remove'; key: string } | { type: 'clear' };

// Единственный канал на вкладку (создаётся лениво при первой записи/подписке).
let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!channel) {
    channel = new BroadcastChannel(HEAVY_SYNC_CHANNEL);
  }
  return channel;
}

/** Отправить сообщение другим вкладкам. Безопасно при недоступном BroadcastChannel. */
export function postHeavySync(message: HeavySyncMessage): void {
  const ch = getChannel();
  if (!ch) return;
  try {
    ch.postMessage(message);
  } catch (e) {
    // Данные HeavyStorage — JSON-совместимые, но при неожиданном несериализуемом
    // значении не роняем приложение, а просто пропускаем трансляцию.
    __devLog('postHeavySync', e);
  }
}

/** Подписаться на сообщения из других вкладок. Возвращает функцию отписки. */
export function subscribeHeavySync(handler: (message: HeavySyncMessage) => void): () => void {
  const ch = getChannel();
  if (!ch) return () => {};
  const listener = (event: MessageEvent<HeavySyncMessage>) => handler(event.data);
  ch.addEventListener('message', listener);
  return () => ch.removeEventListener('message', listener);
}

/** Только для тестов: закрыть канал, чтобы следующий тест создал свежий. */
export function resetHeavySyncForTests(): void {
  if (channel) {
    channel.close();
    channel = null;
  }
}
