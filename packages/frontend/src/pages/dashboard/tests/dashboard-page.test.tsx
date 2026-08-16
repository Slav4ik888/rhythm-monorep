// packages/frontend/src/pages/dashboard/tests/dashboard-page.test.tsx
// Smoke-тест страницы дашборда (контейнер + тело дашборда).

import { screen } from '@testing-library/react';
import DashboardPage from 'pages/dashboard/ui';
import { useUserStore } from 'entities/user';
import { useCompanyStore } from 'entities/company';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

// Изолируем тяжёлые виджеты — их smoke-тесты в widgets/.
jest.mock('widgets/sidebar', () => ({ Sidebar: () => <div>sidebar-mock</div> }));
jest.mock('widgets/dashboard-view', () => ({
  DashboardBodyPanel: () => <div>panel-mock</div>,
  DashboardBodyContent: () => <div>dashboard-body-content-mock</div>,
}));
jest.mock('widgets/view-configurator', () => ({ ViewItemConfigurator: () => null }));
jest.mock('widgets/dashboard-templates', () => ({ DashboardTemplates: () => null }));

// TanStack Query-хуки требуют QueryClientProvider — изолируем от реальных запросов.
jest.mock('shared/api/hooks', () => ({
  useGetDashboardDataQuery: jest.fn(),
  useGetBunchesQuery: jest.fn(),
}));

describe('DashboardPage (smoke)', () => {
  beforeEach(() => {
    useUserStore.setState({ auth: true });
    useCompanyStore.setState({ paramsCompany: { id: 'c1' } as never });
  });

  it('рендерится без ошибок и монтирует сайдбар и тело дашборда', () => {
    renderPage(<DashboardPage />);

    expect(screen.getByText('sidebar-mock')).toBeInTheDocument();
    expect(screen.getByText('dashboard-body-content-mock')).toBeInTheDocument();
  });
});
