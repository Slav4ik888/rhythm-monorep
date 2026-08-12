// packages/frontend/src/pages/policy/tests/policy-page.test.tsx
// Smoke-тест страницы политики конфиденциальности.

import { screen } from '@testing-library/react';
import { renderPage } from 'shared/lib/tests/render-page';
import PolicyPage from '../ui';

// Мокаем API получения политики, чтобы не ходить в сеть в тесте
jest.mock('features/docs/get-policy/model/services', () => ({
  getPolicy: jest.fn().mockResolvedValue('# Политика конфиденциальности'),
}));

// Разрываем циклическую зависимость: страница → shared/ui/pages → ... → use-pages
// → app/providers/routes → route-config → страница. В Jest (CommonJS) она даёт
// undefined-импорт, поэтому подменяем баррель на leaf-константы маршрутов.
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('PolicyPage (smoke)', () => {
  it('рендерится без ошибок, показывает заголовок и загружает контент', async () => {
    renderPage(<PolicyPage />);

    // Заголовок страницы рендерится сразу
    expect(screen.getByRole('heading', { level: 1, name: /Политика конфиденциальности/i })).toBeInTheDocument();

    // Markdown-контент подгружается асинхронно
    expect(await screen.findByText('# Политика конфиденциальности')).toBeInTheDocument();
  });
});
