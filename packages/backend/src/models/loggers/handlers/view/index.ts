import fs from 'fs';
import path from 'path';
import { PASS } from '../../../../logs/pass';
import { capitalize } from '../../../../shared/utils/strings';

const hostname = 'https://rhy.thm.su'; // || 'http://localhost:7575';

export interface LogsViewArgs {
  name: string;
  pass: string;
}

export interface LogsViewResult {
  html: string;
  statusCode: number;
}

/**
 * Возвращает HTML-страницу для просмотра логов.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает { name, pass },
 * возвращает { html, statusCode }.
 */
export const logsViewModel = async (args: LogsViewArgs): Promise<LogsViewResult> => {
  const { name, pass } = args;
  const logPath = path.join(__dirname, `../../../../logs/${name}.log`);

  try {
    if (pass !== PASS) {
      return { html: 'Access denied', statusCode: 403 };
    }

    if (!fs.existsSync(logPath)) {
      return { html: 'Log file not found', statusCode: 404 };
    }

    // Проверка размера файла
    const stats = fs.statSync(logPath);
    if (stats.size > 50 * 1024 * 1024) {
      // 50MB limit
      return { html: 'Log file too large', statusCode: 413 };
    }

    const content = fs.readFileSync(logPath, 'utf8');

    // Отображаем как HTML с подсветкой
    const title = capitalize(name, { first: true });

    const html = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <title>${title} logs</title>
        <style>
          body { font-family: monospace; background: #f5f5f5; padding: 20px; }
          pre { background: white; padding: 20px; border-radius: 5px; }
          .actions { margin: 20px 0; }
          button { padding: 10px 20px; margin-right: 10px; cursor: pointer; }
          .danger { background: #a24f56; color: white; border: none; border-radius: 18px; margin-left: 16px; }
        </style>
      </head>
      <body>
        <h1>${title} logs</h1>
        <div class="actions">
          <a href="${hostname}/api/logs/download/${name}/${pass}" download>Download Log File</a>
          <button class="danger" onclick="clearLog()">Clear Log File</button>
          <button id="copyBtn" onclick="copyLog()">Copy to Clipboard</button>
        </div>
        <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>

        <script>
          async function copyLog() {
            const preElement = document.querySelector('pre');
            const text = preElement.textContent;
            const copyBtn = document.getElementById('copyBtn');

            try {
              await navigator.clipboard.writeText(text);

              // Визуальный фидбек
              const originalText = copyBtn.textContent;
              copyBtn.textContent = 'Copied!';
              copyBtn.style.background = '#4CAF50';

              setTimeout(() => {
                  copyBtn.textContent = originalText;
                  copyBtn.style.background = '';
              }, 2000);
            }
            catch (err) {
              console.error('Failed to copy: ', err);
              // Fallback
              const textArea = document.createElement('textarea');
              textArea.value = text;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);

              alert('Log copied to clipboard!');
            }
          }

          function clearLog() {
            fetch('${hostname}/api/logs/clear/${name}/${pass}', { method: 'GET' })
              .then(response => response.json())
              .then(data => {
                alert(data.message);
              })
              .catch(error => {
                alert('Error: ' + error);
              });
          }
        </script>
      </body>
      </html>
    `;

    return { html, statusCode: 200 };
  } catch (error) {
    return { html: 'Error reading log file', statusCode: 500 };
  }
};
