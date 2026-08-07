import { Next } from 'koa';
import { Context } from '../../../../app/types/global';
import fs from 'fs';
import path from 'path';
import { PASS } from '../../../../logs/pass';



export const logsClearModel = async (ctx: Context, next: Next): Promise<any> => {
  const { name, pass } = ctx.params;
  const logPath = path.join(__dirname, `../../../../logs/${name}.log`);

  try {
    if (pass !== PASS) {
      ctx.status = 403;
      ctx.body = 'Access denied';
      return;
    }

    // Создаем пустой файл (перезаписываем)
    fs.writeFileSync(logPath, '');

    ctx.body = {
      message: 'Log file successfully cleared',
      timestamp: new Date().toISOString()
    };
  }
  catch (error) {
    ctx.status = 500;
    ctx.body = 'Error reading log file';
  }
};
