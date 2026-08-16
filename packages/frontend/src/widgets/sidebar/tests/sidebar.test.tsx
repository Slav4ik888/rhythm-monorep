// packages/frontend/src/widgets/sidebar/tests/sidebar.test.tsx
// Smoke-тест виджета боковой панели.

import { screen } from '@testing-library/react';
import { Sidebar } from 'widgets/sidebar';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

// Переопределяем глобальный мок: для сайдбара нужен isSidebar=true и ширина,
// иначе Sidebar возвращает null.
jest.mock('app/providers/theme/model/hooks/use-ui-configurator-controller', () => ({
  useUIConfiguratorController: () => [
    {
      mode: 'light',
      navbarTransparent: false,
      navbarFixed: true,
      sidebarMini: false,
      isMobileOpenSidebar: false,
      isSidebar: true,
      sidebarWidth: 250,
    },
    jest.fn(),
  ],
}));

describe('Sidebar (smoke)', () => {
  it('рендерится без ошибок и показывает логотип', () => {
    renderPage(<Sidebar />);

    expect(screen.getByAltText('Ритм')).toBeInTheDocument();
  });
});
