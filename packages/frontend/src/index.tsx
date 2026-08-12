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

/* eslint-disable-next-line no-console */
console.log(`Version: ${cfg.VERSION}\nRelease: ${cfg.ASSEMBLY_DATE}`);
__devLog('index', 'Status: ', cfg.IS_DEV ? 'OFFLINE' : 'ONLINE');

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));

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
