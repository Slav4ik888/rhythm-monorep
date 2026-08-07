import { Context } from '../../../../app/types/global';
import { BunchAction } from '../../../../shared/lib/structures/bunch';
import { serviceUpdateTemplate } from '../../services';
import { PartialTemplate, Template } from '../../types';



/** v.2025-07-01 */
export interface UpdateTemplate {
  bunchUpdatedMs : number
  template       : Template | PartialTemplate // Add | Update
  bunchAction    : BunchAction
  // 1) Если нужно перезаписать весь template (например есть удалённые поля,
  // тогда в ДБ их надо обновлять без функции convertToDot)
  // 2) Если надо обновить storedSelected, чтобы исчезла надпись про unsaved
  fullSet?       : boolean
}


/**
 * @requires body.AddNewViews
 */
export const updateTemplateModel = async (ctx: Context): Promise<void> => {
  const { template, bunchUpdatedMs, bunchAction } = ctx.request.body as UpdateTemplate;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated

  // TODO: validateNewView(ctx, userData);

  if (! template || ! bunchUpdatedMs || ! bunchAction ) {
    ctx.throw(400, 'invalid body required field');
  }

  const updated = await serviceUpdateTemplate(ctx);

  ctx.body = updated;
};
