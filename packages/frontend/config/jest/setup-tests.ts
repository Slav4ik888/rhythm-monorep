// packages/frontend/config/jest/setup-tests.ts

import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';

// Мок UIConfiguratorController для тестов, которые не обёрнуты в UIConfiguratorProvider
// (action-main-*.test.tsx, move-item-*.test.tsx)
jest.mock('app/providers/theme/model/hooks/use-ui-configurator-controller', () => ({
  useUIConfiguratorController: () => [
    {
      mode: 'light',
      navbarTransparent: false,
      navbarFixed: true,
      sidebarMini: false,
      isMobileOpenSidebar: false,
    },
    jest.fn(),
  ],
}));
