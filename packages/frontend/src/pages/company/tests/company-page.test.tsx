// packages/frontend/src/pages/company/tests/company-page.test.tsx
// Smoke-тест layout-страницы компании.

import CompanyPage from 'pages/company/ui';
import { useUserStore } from 'entities/user';
import { useCompanyStore } from 'entities/company';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('CompanyPage (smoke)', () => {
  it('не падает и возвращает null без доступа к дашборду', () => {
    useUserStore.setState({ auth: true, _isLoaded: true });
    useCompanyStore.setState({ _isParamsCompanyIdLoaded: false });

    const { container } = renderPage(<CompanyPage />);

    expect(container).toBeEmptyDOMElement();
  });
});
