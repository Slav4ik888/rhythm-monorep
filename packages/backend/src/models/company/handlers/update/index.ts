import { serviceUpdateCompany } from '../../services';
import { PartialCompany } from '../../types';
import { validateCompanyData } from '../../validators';

/** Аргументы для обновления компании (рефакторинг: без ctx) */
export interface UpdateCompanyArgs {
  companyData: PartialCompany;
  userId: string;
}

/**
 * Обновляет данные компании.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает companyData и userId напрямую.
 *
 * @returns обновлённые данные компании
 */
export const updateCompanyModel = async (args: UpdateCompanyArgs): Promise<PartialCompany> => {
  const { companyData, userId } = args;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated: owner

  validateCompanyData(companyData);

  // Update
  const company = await serviceUpdateCompany(companyData, userId);

  return company;
};

/** Сигнатура для обратной совместимости с Koa-контроллером */
export { updateCompanyModel as update };
