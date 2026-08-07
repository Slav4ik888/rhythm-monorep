import bodyParser from 'koa-bodyparser';
import router from './router';


export default function (app) {
  app.use(bodyParser());
  app.use(router.routes());
}
