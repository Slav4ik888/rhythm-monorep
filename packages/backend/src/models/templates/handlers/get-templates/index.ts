import { BunchesUpdated } from '../../../../shared/lib/structures/bunch';
import { serviceGetTemplates } from '../../services';
import { Template } from '../../types';

/** 2025-06-30 */
export type ResGetTemplates = {
  templates: Template[];
  bunchesUpdated: BunchesUpdated;
};

export interface ReqGetTemplates {
  bunchIds: string[]; // То что надо загрузить
}

/**
 * Get all templates Bunches.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает bunchIds напрямую,
 * выбрасывает ошибку вместо ctx.throw.
 */
export async function getTemplatesModel(args: ReqGetTemplates): Promise<ResGetTemplates> {
  const { bunchIds } = args;

  if (!bunchIds) {
    throw Object.assign(new Error('Не переданы bunchIds'), {
      statusCode: 400,
      body: { general: 'Не переданы bunchIds' },
    });
  }

  const result = await serviceGetTemplates(bunchIds);
  return result;
}
