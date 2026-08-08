// packages/backend/src/middleware/index.ts

import bodyParser from 'koa-bodyparser';
import { corsMiddleware } from './cors';
import router from './router';

export default function setupMiddleware(app) {
  app.use(corsMiddleware);
  app.use(bodyParser());
  app.use(router.routes());
}
