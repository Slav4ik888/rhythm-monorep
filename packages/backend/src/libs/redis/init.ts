import { createClient } from 'redis';

export const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

/** Initialize */
async function redisClient() {
  await client.connect();
  console.log('Redis is started!');
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
