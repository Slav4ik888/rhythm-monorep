import { BunchAction } from '../../../../shared/lib/structures/bunch';
import { omit } from '../../../../shared/utils/objects/omit';
import { assertCanEditTemplates } from '../../../company/access';
import type { User } from '../../../user/types';
import { serviceUpdateTemplate } from '../../services/update';
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

/** Аргументы updateTemplateModel */
export interface UpdateTemplateArgs extends UpdateTemplate {
  user: User;
}

/**
 * @requires body.AddNewViews
 */
export const updateTemplateModel = async (args: UpdateTemplateArgs): Promise<UpdateTemplate> => {
  const { template, bunchUpdatedMs, bunchAction, user } = args;

  if (!template || !bunchUpdatedMs || !bunchAction) {
    throw Object.assign(new Error('invalid body required field'), {
      statusCode: 400,
      body: { general: 'invalid body required field' },
    });
  }

  // Шаблоны глобальные — менять может только владелец/привилегированная роль
  assertCanEditTemplates(user);

  // Отсекаем серверные поля (createdAt/lastChange)
  const safeTemplate = omit(template, ['createdAt', 'lastChange']) as UpdateTemplate['template'];

  const updated = await serviceUpdateTemplate({
    template: safeTemplate,
    bunchUpdatedMs,
    bunchAction,
    fullSet: args.fullSet,
    userId: user.id,
  });

  return updated;
};
