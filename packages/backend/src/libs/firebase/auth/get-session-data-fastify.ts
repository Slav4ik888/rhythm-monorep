// packages/backend/src/libs/firebase/auth/get-session-data-fastify.ts
// Fastify-версия getSessionData (без ctx, работает с FastifyRequest)
// Извлекает userId и sessionCookie из заголовка Cookie

import { FastifyRequest } from 'fastify';
import { cfg } from '../../../app/config';

export interface ResGetSessionDataFastify {
  userId: string;
  sessionCookie: string;
}

/** Извлечь данные сессии из Fastify request */
export function getSessionDataFastify(request: FastifyRequest): ResGetSessionDataFastify {
  const cookieHeader = request.headers.cookie || '';
  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach((item) => {
    const [key, ...rest] = item.split('=');
    if (key && rest.length > 0) {
      cookies[key.trim()] = rest.join('=').trim();
    }
  });

  const cookieData = (cookies[cfg.COOKIE_NAME] || '').split('/');

  return {
    userId: cookieData[0] || '',
    sessionCookie: cookieData[1] || '',
  };
}
