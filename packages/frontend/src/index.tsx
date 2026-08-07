import * as ReactDOM from 'react-dom/client';
import 'regenerator-runtime/runtime';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from 'app/providers/store';
import { ErrorBoundary } from 'app/providers/error-boundary';
import { App } from './app';
import { HelmetProvider } from 'react-helmet-async';
import cfg from 'app/config';
import { UIConfiguratorProvider } from 'app/providers/theme';
import { __devLog } from 'shared/lib/tests/__dev-log';

/* eslint-disable-next-line no-console */
console.log(`Version: ${cfg.VERSION}\nRelease: ${cfg.ASSEMBLY_DATE}`);
__devLog('index', 'Status: ', cfg.IS_DEV ? 'OFFLINE' : 'ONLINE');



// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <StoreProvider>
        <ErrorBoundary>
          <UIConfiguratorProvider>
            <App />
          </UIConfiguratorProvider>
        </ErrorBoundary>
      </StoreProvider>
    </BrowserRouter>
  </HelmetProvider>
);



// git add . && git commit -m "updated 1.53.0 some fixed" && git push -u origin main
// деплой весь         /var/www/vtempe/data/rhythm/deploy.sh
// деплой только фронт /var/www/vtempe/data/rhythm/deploy.sh -frontOnly
