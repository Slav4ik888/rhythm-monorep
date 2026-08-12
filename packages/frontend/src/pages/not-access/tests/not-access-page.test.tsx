// packages/frontend/src/pages/not-access/tests/not-access-page.test.tsx
// Smoke-тест статической страницы 403 (нет доступа).

import { screen } from '@testing-library/react';
import { renderPage } from 'shared/lib/tests/render-page';
import { NotAccessPage } from '..';

// Разрываем циклическую зависимость: страница → shared/ui/pages → ... → use-pages
// → app/providers/routes → route-config → страница. В Jest (CommonJS) она даёт
// undefined-импорт, поэтому подменяем баррель на leaf-константы маршрутов.
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('NotAccessPage (smoke)', () => {
  it('рендерится без ошибок и показывает сообщение о 403', () => {
    renderPage(<NotAccessPage />);

    expect(screen.getByText('Извините, у вас нет доступа к этой странице.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Перейти на главную/i })).toBeInTheDocument();
  });
});
