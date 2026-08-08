// packages/backend/src/middleware/cors/index.ts

// Ручной CORS middleware
// Браузер перед PATCH-запросами шлёт OPTIONS preflight,
// без обработки которого запрос блокируется

import { Context, Next } from 'koa';

export const corsMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  // Разрешаем запросы с любого origin в dev-режиме
  ctx.set('Access-Control-Allow-Origin', ctx.get('Origin') || '*');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Client-Version');

  // Preflight (OPTIONS) — сразу отвечаем 204, не передавая дальше
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }

  await next();
};
