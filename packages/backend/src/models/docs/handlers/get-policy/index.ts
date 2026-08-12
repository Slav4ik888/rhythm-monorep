import path from 'path';
import fs from 'fs';

/** Возвращает текст политики конфиденциальности */
export const getPolicyModel = async (): Promise<{ policy: string }> => {
  const pathStr = path.join(__dirname, '../../../../downloads/admin/policy.md');
  const policy = fs.readFileSync(pathStr, 'utf8');
  return { policy };
};
