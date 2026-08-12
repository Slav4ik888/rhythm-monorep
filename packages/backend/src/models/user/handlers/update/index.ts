import { serviceUpdateUser } from '../../services';
import { PartialUser } from '../../types';

/** Аргументы для updateUserModel */
export interface UpdateUserArgs {
  userData: PartialUser;
  userId: string;
}

/**
 * Обновление данных пользователя
 * @requires userData as PartialUser
 */
export const updateUserModel = async ({ userData, userId }: UpdateUserArgs): Promise<void> => {
  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated

  // TODO: validateUser(ctx, userData);

  // Update
  await serviceUpdateUser(userData, userId);
};
