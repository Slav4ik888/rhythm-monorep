// packages/frontend/src/widgets/navbar/tests/navbar.test.tsx
// Smoke-тест виджета навигационной панели (неавторизованный пользователь).

import { screen } from '@testing-library/react';
import { Navbar } from 'widgets/navbar';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('Navbar (smoke)', () => {
  it('рендерится без ошибок для неавторизованного пользователя', () => {
    renderPage(<Navbar />);

    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByAltText('Ритм')).toBeInTheDocument();
  });
});
