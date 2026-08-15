// packages/frontend/src/index.tsx

import * as ReactDOM from 'react-dom/client';
import 'regenerator-runtime/runtime';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'app/providers/error-boundary';
import { App } from './app';
import { HelmetProvider } from 'react-helmet-async';
import cfg from 'app/config';
import { UIConfiguratorProvider } from 'app/providers/theme';
import { QueryProvider } from 'app/providers/query-provider';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { LS } from 'shared/lib/local-storage';

/* eslint-disable-next-line no-console */
console.log(`Version: ${cfg.VERSION}\nRelease: ${cfg.ASSEMBLY_DATE}`);
__devLog('index', 'Status: ', cfg.IS_DEV ? 'OFFLINE' : 'ONLINE');

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Перед рендером инициализируем «тяжёлое» хранилище (IndexedDB):
 * миграция существующих данных из localStorage + загрузка в in-memory кеш.
 * Это гарантирует, что синхронные чтения LS.getBunches/getDataState/...
 * в сторах и useMemo увидят данные уже на первом рендере.
 */
const bootstrap = async () => {
  try {
    await LS.initHeavyStorage();
  } catch (e) {
    // Если IndexedDB недоступен (например, приватный режим) — рендерим без кеша,
    // данные дозагрузятся с сервера.
    __devLog('index', 'initHeavyStorage failed', e);
  }

  root.render(
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <UIConfiguratorProvider>
            <QueryProvider>
              <App />
            </QueryProvider>
          </UIConfiguratorProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>,
  );
};

bootstrap();
