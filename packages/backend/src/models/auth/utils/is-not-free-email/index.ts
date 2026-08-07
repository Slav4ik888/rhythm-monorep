import { serviceFindUserByEmail } from '../../../user';


/** Проверяем свободен ли email */
export const isNotFreeEmail = async (email: string): Promise<boolean> => {
  const user = await serviceFindUserByEmail(email);
  
  return Boolean(user);
}
