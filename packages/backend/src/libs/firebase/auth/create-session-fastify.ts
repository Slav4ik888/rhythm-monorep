// packages/backend/src/libs/firebase/auth/create-session-fastify.ts
// Fastify-версия createSession (вместо ctx.cookies.set — reply.header)
// Используется в NestJS AuthController для login/signup

import { FastifyReply } from 'fastify';
import { cfg } from '../../../app/config';
import { User } from '../../../models/user';
import { redisSetSession } from '../../redis';
import { admin } from '../config/admin-sdk';

/** Создать сессионную cookie через Fastify reply */
export async function createSessionFastify(reply: FastifyReply, idToken: string, user: User): Promise<void> {
  const expiresIn = cfg.SESSION_EXP;

  // Create the session cookie via Firebase Admin
  const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

  // Сохранить сессию в Redis
  redisSetSession(user, sessionCookie);

  // Добавить userId в cookie (формат: userId/sessionCookie)
  const cookie = `${user.id}/${sessionCookie}`;

  // Установить Set-Cookie через Fastify (вместо ctx.cookies.set)
  reply.header('Set-Cookie', `${cfg.COOKIE_NAME}=${cookie}; Path=/; Max-Age=${expiresIn / 1000}; HttpOnly`);
}
