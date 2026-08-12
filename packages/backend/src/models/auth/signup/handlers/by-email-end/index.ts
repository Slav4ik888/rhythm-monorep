// packages/backend/src/models/auth/signup/handlers/by-email-end/index.ts
// Рефакторинг: убран ctx, принимает SignupDataEnd, возвращает данные + userCredential для контроллера

import { createNewCompany, createNewUser, complectionUser } from '../../services';
import { checkIsNotFreeEmail } from '../../../utils';
import { redisGetSignup } from '../../../../../libs/redis';
import { validateSignupDataEnd } from '../../validators';
import { checkCodeAnswer } from './utils';
import { sendNotifications } from './send-notifications';
import { serviceIncreaseRegisterEnded } from '../../../../partner';
import { SignupDataEnd } from '../../types';
import { UserCredential } from 'firebase/auth';
import { User } from '../../../../user';
import { Company } from '../../../../company';

export interface SignupByEmailEndArgs {
  signupDataEnd: SignupDataEnd;
}

export interface SignupByEmailEndResult {
  newUserData: User;
  newCompanyData: Company;
  userCredential: UserCredential;
  message: string;
}

export async function signupByEmailEndModel({ signupDataEnd }: SignupByEmailEndArgs): Promise<SignupByEmailEndResult> {
  const { email, emailCode } = signupDataEnd;

  validateSignupDataEnd(signupDataEnd);

  const data = await redisGetSignup(email); // Получить данные (код и signupData) с Redis

  await checkCodeAnswer(data, emailCode);

  const { signupData } = data;
  await checkIsNotFreeEmail(signupData.email);

  const { newUserData, userCredential } = await createNewUser(signupData);
  const { newCompanyData, companyId } = await createNewCompany(signupData, newUserData.id);

  await complectionUser(newUserData, companyId);

  const { referrerId } = newUserData.partner;
  if (referrerId) await serviceIncreaseRegisterEnded(referrerId, email, companyId);

  await sendNotifications(newUserData, data.signupData?.firstName);

  return {
    newUserData,
    newCompanyData,
    userCredential,
    message: 'Поздравляем с успешной регистрацией!',
  };
}
