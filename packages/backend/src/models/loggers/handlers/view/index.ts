import { Next } from 'koa';
import { Context } from '../../../../app/types/global';
import fs from 'fs';
import path from 'path';
import { PASS } from '../../../../logs/pass';
import { capitalize } from '../../../../shared/utils/strings';



const hostname = 'https://rhy.thm.su'; // || 'http://localhost:7575';

export const logsViewModel = async (ctx: Context, next: Next): Promise<any> => {
  const { name, pass } = ctx.params;
  const logPath = path.join(__dirname, `../../../../logs/${name}.log`);

  try {
    if (pass !== PASS) {
      ctx.status = 403;
      ctx.body = 'Access denied';
      return;
    }

    if (! fs.existsSync(logPath)) {
      ctx.status = 404;
      ctx.body = 'Log file not found';
      return;
    }

    // Проверка размера файла
    const stats = fs.statSync(logPath);
    if (stats.size > 50 * 1024 * 1024) { // 50MB limit
      ctx.status = 413;
      ctx.body = 'Log file too large';
      return;
    }

    const content = fs.readFileSync(logPath, 'utf8');

    // Отображаем как HTML с подсветкой
    const title = capitalize(name, { first: true });

    ctx.type = 'html';
    ctx.body = `
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
  }
  catch (error) {
    ctx.status = 500;
    ctx.body = 'Error reading log file';
  }
};
