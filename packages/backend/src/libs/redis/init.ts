// packages/backend/src/libs/redis/init.ts

import { createClient } from 'redis';

export const client = createClient({
  socket: {
    // Таймаут подключения — чтобы запрос не зависал при недоступном Redis
    connectTimeout: 5000,
    // Не блокировать выполнение, если Redis недоступен
    reconnectStrategy: false,
  },
});

client.on('error', (err) => {
  // Redis недоступен — не фатально для dev-режима
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  console.log('Redis Client Error', err);
});

/** Initialize */
async function redisClient() {
  try {
    await client.connect();
    console.log('Redis is started!');
  } catch {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Redis connection failed in production');
    }
    console.log('Redis не подключён — работаем без кэша');
  }
}

redisClient();

//
// redis-server
//
// To start redis now and restart at login:
//   brew services start redis
// Or, if you don't want/need a background service you can just run:
//   /usr/local/opt/redis/bin/redis-server /usr/local/etc/redis.conf
//
// Successfully started `redis` (label: homebrew.mxcl.redis)
//
