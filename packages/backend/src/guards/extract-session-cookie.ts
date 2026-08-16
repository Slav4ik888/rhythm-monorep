// packages/backend/src/guards/extract-session-cookie.ts
// Извлекает session-часть из Firebase session cookie (формат "uid/sessionCookie").

import { cfg } from '../app/config';

/** Минимальная форма запроса, из которой извлекается session cookie */
interface CookiesRequest {
  cookies?: Record<string, string>;
  headers?: { cookie?: string };
}

/** Извлекает session-часть из cookies или заголовка cookie */
export const extractSessionCookie = (request: CookiesRequest): string | null => {
  const cookies = request.cookies || {};
  const cookieValue: string = cookies[cfg.COOKIE_NAME] || '';

  if (!cookieValue) {
    const cookieHeader: string = request.headers?.cookie || '';
    const match = cookieHeader.match(new RegExp(`${cfg.COOKIE_NAME}=([^;]+)`));
    if (match) {
      const parts = match[1].split('/');
      return parts[1] || null;
    }
    return null;
  }

  const parts = cookieValue.split('/');
  return parts[1] || null;
};
