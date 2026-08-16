// packages/frontend/src/widgets/demo/goto-demo-btn/tests/goto-demo-btn.test.tsx
// Smoke-тест кнопки перехода к демо-дашбордам.

import { screen } from '@testing-library/react';
import { GotoDemoBtn } from 'widgets/demo/goto-demo-btn';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('GotoDemoBtn (smoke)', () => {
  it('рендерит кнопку со ссылкой на демо', () => {
    renderPage(<GotoDemoBtn />);

    expect(screen.getByText('Посмотреть примеры дашбордов')).toBeInTheDocument();
  });
});
