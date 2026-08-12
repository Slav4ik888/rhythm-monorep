// packages/backend/src/models/auth/signup/handlers/by-email-start/index.ts
// Рефакторинг: убран ctx, принимает SignupData, возвращает результат

import { validateSignupData } from '../../validators';
import { checkIsNotFreeEmail } from '../../../utils';
import { signupSendCodeModel } from './send-code';
import { SignupData } from '../../types';
import { serviceIncreaseRegisterStarted } from '../../../../partner';

export interface SignupByEmailStartArgs {
  signupData: SignupData;
}

export interface SignupByEmailStartResult {
  message: string;
}

export async function signupByEmailStartModel({
  signupData,
}: SignupByEmailStartArgs): Promise<SignupByEmailStartResult> {
  const { email, partnerId } = signupData;

  validateSignupData(signupData);
  await checkIsNotFreeEmail(email);
  const result = await signupSendCodeModel({ signupData });
  if (partnerId) await serviceIncreaseRegisterStarted(signupData);

  return result;
}
