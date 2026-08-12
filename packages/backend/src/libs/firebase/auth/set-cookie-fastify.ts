// packages/backend/src/libs/firebase/auth/set-cookie-fastify.ts
// Fastify-версия setCookie (без ctx, использует FastifyReply)
// Используется в NestJS AuthController для login/signup

import { FastifyReply } from 'fastify';
import { UserCredential } from 'firebase/auth';
import { User } from '../../../models/user';
import { createSessionFastify } from './create-session-fastify';

/** Создать токен и сессионную cookie через Fastify */
export async function setCookieFastify(
  reply: FastifyReply,
  userCredential: UserCredential,
  user: User,
  _logTemp: string,
): Promise<void> {
  // CSRF-проверка временно не выполняется в NestJS-версии
  // (будет добавлена позже как NestJS Guard)

  const idToken = await userCredential.user.getIdToken(true);

  await createSessionFastify(reply, idToken, user);
}
