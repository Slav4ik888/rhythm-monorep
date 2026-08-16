import { creatorFixDate } from '../../../base';
import type { User } from '../../../user/types';
import { assertCanEditCompany } from '../../access';
import { serviceGetCompany, serviceUpdateCompany } from '../../services';
import { PartialCompany } from '../../types';
import { validateCompanyData } from '../../validators';
import { filterCompanyData } from '../../utils';

/** Аргументы для обновления компании */
export interface UpdateCompanyArgs {
  companyData: PartialCompany;
  user: User;
}

/**
 * Обновляет данные компании.
 * Проверяет права (владелец или привилегированная роль) и отсекает поля,
 * которые нельзя менять через update (ownerId, owner, status, createdAt, lastChange).
 *
 * @returns обновлённые данные компании
 */
export const updateCompanyModel = async (args: UpdateCompanyArgs): Promise<PartialCompany> => {
  const { companyData, user } = args;
  const companyId = companyData?.id;

  if (!companyId) {
    throw Object.assign(new Error('invalid body required field'), {
      statusCode: 400,
      body: { general: 'invalid body required field' },
    });
  }

  // Проверка прав: редактировать профиль компании может только владелец или привилегированная роль
  const company = await serviceGetCompany(companyId);
  assertCanEditCompany(user, company);

  // Защита от mass assignment: убираем запрещённые поля
  const filtered = filterCompanyData(companyData);
  // lastChange всегда проставляет сервер
  filtered.lastChange = creatorFixDate(user.id);

  validateCompanyData(filtered);

  return serviceUpdateCompany(filtered, user.id);
};

/** Сигнатура для обратной совместимости с Koa-контроллером */
export { updateCompanyModel as update };
