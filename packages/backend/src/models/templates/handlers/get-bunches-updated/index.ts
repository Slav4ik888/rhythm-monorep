import { BunchesUpdated } from '../../../../shared/lib/structures/bunch';
import { serviceGetBunchesUpdated } from '../../services';

/**
 * Get all templates Bunches.
 * Рефакторинг: убрана зависимость от Koa ctx — возвращает данные напрямую.
 */
export async function getBunchesUpdatedModel(): Promise<BunchesUpdated> {
  const result = await serviceGetBunchesUpdated();
  return result;
}
