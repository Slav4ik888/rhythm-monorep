// packages/frontend/src/widgets/footer/tests/footer.test.tsx
// Smoke-тест виджета подвала.

import { screen } from '@testing-library/react';
import { Footer } from 'widgets/footer';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('Footer (smoke)', () => {
  it('рендерится без ошибок и показывает ссылки и копирайт', () => {
    renderPage(<Footer />);

    expect(screen.getByText('Учебный центр Основа')).toBeInTheDocument();
    expect(screen.getByText('Политика конфиденциальности')).toBeInTheDocument();
    expect(screen.getByText('Договор-оферта (услуги)')).toBeInTheDocument();
  });
});
