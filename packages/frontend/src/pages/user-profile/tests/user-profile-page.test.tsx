// packages/frontend/src/pages/user-profile/tests/user-profile-page.test.tsx
// Smoke-тест страницы личного кабинета пользователя.

import { screen } from '@testing-library/react';
import UserProfilePage from 'pages/user-profile/ui';
import { useUserStore } from 'entities/user';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

// Изолируем сервис обновления пользователя — его логика покрыта отдельно.
jest.mock('features/user', () => ({
  useFeaturesUser: () => ({ serviceUpdateUser: jest.fn() }),
}));

describe('UserProfilePage (smoke)', () => {
  beforeEach(() => {
    useUserStore.setState({
      auth: true,
      user: {
        id: 'u1',
        email: 'user@example.com',
        person: { fio: { secondName: 'Иванов', firstName: 'Иван', middleName: 'Иванович' } },
      } as never,
    });
  });

  it('рендерится без ошибок и показывает поля профиля', () => {
    renderPage(<UserProfilePage />);

    expect(screen.getByRole('heading', { name: 'Профиль пользователя' })).toBeInTheDocument();
    // MUI TextField рендерит label и legend с одинаковым текстом — ищем по ассоциации label.
    expect(screen.getByLabelText('Фамилия')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
  });
});
