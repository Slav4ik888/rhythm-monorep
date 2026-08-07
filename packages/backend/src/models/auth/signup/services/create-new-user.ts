import { SignupData } from '../types';
import { createNewUserData } from '../utils';
import { auth } from '../../../../libs/firebase';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { Role, User } from '../../../user';
import { creatorFixDate } from '../../../base';


interface CreateNewUser {
  userCredential : UserCredential
  newUserData    : User
}

/** Create new User data without CompanyId */
export const createNewUser = async (data: SignupData): Promise<CreateNewUser> => {
  const
    newUserData = createNewUserData(data),
    userCredential = await createUserWithEmailAndPassword(auth, newUserData.email, newUserData.password),
    userId = userCredential.user.uid;

  newUserData.id         = userId;
  newUserData.role       = Role.OWNER;
  newUserData.createdAt  = creatorFixDate(userId);
  newUserData.lastChange = creatorFixDate(userId);

  delete newUserData.password;
  delete newUserData.confirmPassword;
  delete newUserData.isMobile;


  return {
    userCredential,
    newUserData
  }
}
