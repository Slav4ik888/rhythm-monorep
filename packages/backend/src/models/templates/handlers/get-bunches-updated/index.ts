import { Context } from '../../../../app/types/global';
import { serviceGetBunchesUpdated } from '../../services';



/**
 * Get all templates Bunches
 */
export async function getBunchesUpdatedModel(ctx: Context): Promise<any> {
  const result = await serviceGetBunchesUpdated();

  ctx.body = result;
}
