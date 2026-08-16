// packages/frontend/src/pages/root/tests/root-page.test.tsx
// Smoke-тест главной страницы (неавторизованный пользователь).

import { screen } from '@testing-library/react';
import { RootPage } from 'pages/root';
import { useUserStore } from 'entities/user';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('RootPage (smoke)', () => {
  it('рендерится без ошибок для неавторизованного пользователя', () => {
    useUserStore.setState({ auth: false });

    renderPage(<RootPage />);

    expect(screen.getByText(/Настрой «Ритм» своей компании!/)).toBeInTheDocument();
    expect(screen.getByText('Посмотреть примеры дашбордов')).toBeInTheDocument();
  });
});
