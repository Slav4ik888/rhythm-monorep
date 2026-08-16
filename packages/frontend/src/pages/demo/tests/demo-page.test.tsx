// packages/frontend/src/pages/demo/tests/demo-page.test.tsx
// Smoke-тест страницы демо-примеров.

import { screen } from '@testing-library/react';
import DemoPage from 'pages/demo/ui';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('DemoPage (smoke)', () => {
  it('рендерится без ошибок и показывает демо-карточки', () => {
    renderPage(<DemoPage />);

    expect(screen.getByRole('heading', { name: 'Демо-страницы' })).toBeInTheDocument();
    expect(screen.getByText('Яркая панель')).toBeInTheDocument();
    expect(screen.getByText('Светлосерая панель')).toBeInTheDocument();
  });
});
