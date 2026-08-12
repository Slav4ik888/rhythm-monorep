import { PartialCompany } from '../../types';
import { validate } from '../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../libs/validators/ajv/schemas/schema-names';

/**
 * Валидирует данные компании.
 * Рефакторинг: убрана зависимость от Koa ctx — вместо ctx.throw выбрасывает ошибку.
 */
export const validateCompanyData = (data: PartialCompany): void => {
  const { valid, errors } = validate(SCHEMA_NAME.COMPANY, data);
  if (!valid) {
    throw Object.assign(new Error('Validation error'), {
      statusCode: 400,
      body: errors,
    });
  }
};
