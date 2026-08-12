import { BunchAction } from '../../../../shared/lib/structures/bunch';
import { serviceUpdateTemplate, ServiceUpdateTemplateArgs } from '../../services/update';
import { PartialTemplate, Template } from '../../types';

/** v.2025-07-01 */
export interface UpdateTemplate {
  bunchUpdatedMs: number;
  template: Template | PartialTemplate; // Add | Update
  bunchAction: BunchAction;
  // 1) Если нужно перезаписать весь template (например есть удалённые поля,
  // тогда в ДБ их надо обновлять без функции convertToDot)
  // 2) Если надо обновить storedSelected, чтобы исчезла надпись про unsaved
  fullSet?: boolean;
}

/**
 * @requires body.AddNewViews
 * Рефакторинг: убрана зависимость от Koa ctx — принимает явные аргументы + userId.
 */
export const updateTemplateModel = async (args: ServiceUpdateTemplateArgs): Promise<UpdateTemplate> => {
  const { template, bunchUpdatedMs, bunchAction } = args;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated
  // TODO: validateNewView(userData);

  if (!template || !bunchUpdatedMs || !bunchAction) {
    throw Object.assign(new Error('invalid body required field'), {
      statusCode: 400,
      body: { general: 'invalid body required field' },
    });
  }

  const updated = await serviceUpdateTemplate(args);
  return updated;
};
