import { Context } from '../../../../app/types/global';
import { BunchesUpdated } from '../../../../shared/lib/structures/bunch';
import { serviceGetTemplates } from '../../services';
import { Template } from '../../types';



/** 2025-06-30 */
export type ResGetTemplates = {
  templates      : Template[]
  bunchesUpdated : BunchesUpdated
}


interface ReqGetTemplates {
  bunchIds: string[] // То что надо загрузить
}

/**
 * Get all templates Bunches
 */
export async function getTemplatesModel(ctx: Context): Promise<any> {
  const { bunchIds } = ctx.request.body as ReqGetTemplates;

  if (! bunchIds) return ctx.throw(400, 'Не переданы bunchIds');

  const result = await serviceGetTemplates(bunchIds);

  ctx.body = result;
}
