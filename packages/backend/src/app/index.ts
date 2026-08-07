import Koa from 'koa';
import { getUserDataTemp, loggerServer } from '../libs/loggers';
import middleware from '../middleware';
import '../shared/utils/dotenv';


const app = new Koa();
// TODO: app.context.db = db();

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) ctx.throw(404);
  }
  catch (err) {
    // Logs
    let message = getUserDataTemp(ctx);
    message += `, [status]: ${err.status}, [url]: ${ctx.url}, [message]: ${err.message}, [error]: ${JSON.stringify(err)}`; // (err, null, 2)}`);
    loggerServer.error(message);

    // Send response
    if (err.status) {
      ctx.status = err.status;
      ctx.body   = { error: err.message };
    }
    else {
      console.error(err);
      ctx.status = 500;
      ctx.body   = { error: 'Internal server error' };
    }
  }
});

middleware(app);

export default app;
