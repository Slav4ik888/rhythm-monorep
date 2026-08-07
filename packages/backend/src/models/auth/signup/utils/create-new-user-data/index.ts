import { isNotUndefined } from '../../../../../libs/validators';
import { cloneObj } from '../../../../../shared/utils/objects';
import { User, Role, creatorUser } from '../../../../user';
import { SignupData } from '../../types';



export type NewUser = User & {
  password        : string
  confirmPassword : string
  permissions     : boolean // Разрешения на обработку персональных данных
  isMobile        : boolean
}

export const createNewUserData = (data: SignupData, role?: Role): NewUser => {
  const {
    partnerId, password, confirmPassword, permissions, firstName, secondName, middleName, isMobile, phoneNumber
  } = data;

  const user: NewUser = {
    ...cloneObj(creatorUser({ ...data, role })),
    password,
    confirmPassword,
    permissions,
    isMobile
  };

  if (isNotUndefined(firstName))   user.person.fio.firstName  = firstName
  if (isNotUndefined(secondName))  user.person.fio.secondName = secondName
  if (isNotUndefined(middleName))  user.person.fio.middleName = middleName
  if (isNotUndefined(phoneNumber)) user.person.phoneNumber    = phoneNumber
  if (isNotUndefined(partnerId))   user.partner.referrerId    = partnerId

  return user
};
