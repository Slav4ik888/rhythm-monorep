// packages/frontend/src/widgets/logo-btn/tests/logo-btn.test.tsx
// Smoke-тест кнопки-логотипа.

import { screen } from '@testing-library/react';
import { LogoBtn } from 'widgets/logo-btn';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('LogoBtn (smoke)', () => {
  it('рендерит логотип с alt "Ритм"', () => {
    renderPage(<LogoBtn />);

    expect(screen.getByAltText('Ритм')).toBeInTheDocument();
  });
});
