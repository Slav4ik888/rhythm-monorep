import { BunchesUpdated } from 'shared/lib/structures/bunch';


/**
 * Сравнивает версии bunches и возвращает ID тех, что нужно обновить
 * @param companyBunchesUpdated - текущие метки времени с сервера
 * @param localBunchesUpdated - метки из LocalStorage
 * @returns массив bunchId для обновления
 */
export function getBunchesToUpdate(
  companyBunchesUpdated : BunchesUpdated,
  localBunchesUpdated   : BunchesUpdated = {}
): string[] {
  if (! companyBunchesUpdated) return [];
  return Object.entries(companyBunchesUpdated)
    .filter(([bunchId, serverTimestamp]) => {
      const localTimestamp = localBunchesUpdated[bunchId];
      // Обновляем если:
      // 1. Нет локальной версии
      // 2. Серверная версия новее
      return ! localTimestamp || serverTimestamp > localTimestamp;
    })
    .map(([bunchId]) => bunchId);
}
