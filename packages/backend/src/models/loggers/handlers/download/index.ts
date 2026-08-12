import fs from 'fs';
import path from 'path';
import { PASS } from '../../../../logs/pass';

export interface LogsDownloadArgs {
  name: string;
  pass: string;
}

export interface LogsDownloadResult {
  statusCode: number;
  body?: string | fs.ReadStream;
  contentType?: string;
  contentDisposition?: string;
}

/**
 * Отдаёт лог-файл для скачивания.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает { name, pass },
 * возвращает { statusCode, body, contentType, contentDisposition }.
 */
export const logsDownloadModel = async (args: LogsDownloadArgs): Promise<LogsDownloadResult> => {
  const { name, pass } = args;
  const logPath = path.join(__dirname, `../../../../logs/${name}.log`);

  try {
    if (pass !== PASS) {
      return { statusCode: 403, body: 'Access denied' };
    }

    if (!fs.existsSync(logPath)) {
      return { statusCode: 404, body: 'Log file not found' };
    }

    // Проверка размера файла
    const stats = fs.statSync(logPath);
    if (stats.size > 50 * 1024 * 1024) {
      // 50MB limit
      return { statusCode: 413, body: 'Log file too large' };
    }

    return {
      statusCode: 200,
      body: fs.createReadStream(logPath),
      contentType: 'text/plain',
      contentDisposition: 'attachment; filename="errors.log"',
    };
  } catch (error) {
    return { statusCode: 500, body: 'Error reading log file' };
  }
};
