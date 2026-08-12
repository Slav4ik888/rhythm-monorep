// packages/frontend/src/pages/not-found/tests/not-found-page.test.tsx
// Smoke-тест статической страницы 404 (страница не найдена).

import { screen } from '@testing-library/react';
import { renderPage } from 'shared/lib/tests/render-page';
import { NotFoundPage } from '..';

// Разрываем циклическую зависимость: страница → shared/ui/pages → ... → use-pages
// → app/providers/routes → route-config → страница. В Jest (CommonJS) она даёт
// undefined-импорт, поэтому подменяем баррель на leaf-константы маршрутов.
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('NotFoundPage (smoke)', () => {
  it('рендерится без ошибок и показывает сообщение о 404', () => {
    renderPage(<NotFoundPage />);

    expect(screen.getByText('Извините, запрошенная страница не найдена.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Перейти на главную/i })).toBeInTheDocument();
  });
});
