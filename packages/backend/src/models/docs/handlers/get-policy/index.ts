import { Context } from '../../../../app/types/global';
import path from 'path';
import fs from 'fs';



/** Отправка "Политики конфиденциальности" */
export const getPolicyModel = async (ctx: Context): Promise<any> => {

  const pathStr = path.join(__dirname, '../../../../downloads/admin/policy.md');
  const policy = fs.readFileSync(pathStr, 'utf8');

  ctx.body = { policy };
};
