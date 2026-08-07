import { User } from '../../../types';
import { getValueIfNotUndefined as show } from 'shared/helpers/strings';


export const getUserName = (user: User): string => {
  if (! user?.person?.fio) return '';

  const { firstName, middleName, secondName } = user.person.fio;
  return (
    `${show(firstName)} ${
    show(middleName)} ${
    show(secondName)}`
  ).trim();
};
