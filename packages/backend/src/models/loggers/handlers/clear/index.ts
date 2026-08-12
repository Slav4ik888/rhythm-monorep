import fs from 'fs';
import path from 'path';
import { PASS } from '../../../../logs/pass';

export interface LogsClearArgs {
  name: string;
  pass: string;
}

export interface LogsClearResult {
  statusCode: number;
  body: any;
}

/**
 * Очищает лог-файл.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает { name, pass },
 * возвращает { statusCode, body }.
 */
export const logsClearModel = async (args: LogsClearArgs): Promise<LogsClearResult> => {
  const { name, pass } = args;
  const logPath = path.join(__dirname, `../../../../logs/${name}.log`);

  try {
    if (pass !== PASS) {
      return { statusCode: 403, body: 'Access denied' };
    }

    // Создаем пустой файл (перезаписываем)
    fs.writeFileSync(logPath, '');

    return {
      statusCode: 200,
      body: {
        message: 'Log file successfully cleared',
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    return { statusCode: 500, body: 'Error reading log file' };
  }
};
