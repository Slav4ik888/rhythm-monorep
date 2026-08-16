import { serviceUpdateUser } from '../../services';
import { PartialUser, User } from '../../types';
import { filterUserData } from '../../utils/filter-user-data';

/** Аргументы для updateUserModel */
export interface UpdateUserArgs {
  userData: PartialUser;
  user: User;
}

/**
 * Обновление данных пользователя.
 * Защита от mass assignment: разрешено менять только person/settings,
 * а id и companyId всегда берутся из аутентифицированного пользователя.
 *
 * @requires userData as PartialUser
 */
export const updateUserModel = async ({ userData, user }: UpdateUserArgs): Promise<void> => {
  // Разрешаем менять только поля профиля (person/settings)
  const filtered = filterUserData(userData);

  // id и companyId нельзя подменить — берём из аутентифицированного пользователя
  const safe: PartialUser = {
    ...filtered,
    id: user.id,
    companyId: user.companyId,
  };

  // Update
  await serviceUpdateUser(safe, user.id);
};
