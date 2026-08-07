import { ACCESS_PRIORITY } from '../../consts';
import { AccessLevel } from '../../types';



/**
 * Проверяет, достаточно ли прав у пользователя
 * @param userAccess - текущий уровень доступа пользователя
 * @param requiredAccess - требуемый уровень доступа
 * @returns true если прав достаточно, false если нет
 */
export const canAccess = (
  userAccess     : AccessLevel | undefined,
  requiredAccess : AccessLevel
): boolean => {
  if (! userAccess) return false;

  return ACCESS_PRIORITY[userAccess] >= ACCESS_PRIORITY[requiredAccess];
};
