import type { BunchesUpdated } from 'shared/lib/structures/bunch';
import type { BunchesViewItem } from '../../../types';
import { getBunchesToUpdate } from '../get-bunches-to-update';

/**
 * Возвращает bunchId, которые нужно загрузить с сервера.
 * Учитывает не только «устаревшие» по timestamp (getBunchesToUpdate),
 * но и те, чьё содержимое отсутствует/пустое в LS.
 *
 * Это чинит рассинхрон LS: bunch мог быть помечен «свежим» в viewBunchesUpdated,
 * а его фактическое содержимое в bunches — отсутствовать (пустой {}), из-за чего
 * дашборд оставался пустым (viewItems не из чего собирать).
 */
export function getBunchesForLoad(
  companyBunchesUpdated: BunchesUpdated,
  localBunchesUpdated: BunchesUpdated = {},
  localBunches: BunchesViewItem = {},
): string[] {
  const toUpdate = getBunchesToUpdate(companyBunchesUpdated, localBunchesUpdated);

  const emptyOrMissing = Object.keys(companyBunchesUpdated || {}).filter(
    (bunchId) => !localBunches[bunchId] || Object.keys(localBunches[bunchId] || {}).length === 0,
  );

  return Array.from(new Set([...toUpdate, ...emptyOrMissing]));
}
