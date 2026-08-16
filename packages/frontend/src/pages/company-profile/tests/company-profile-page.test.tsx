// packages/frontend/src/pages/company-profile/tests/company-profile-page.test.tsx
// Smoke-тест страницы профиля компании.

import { screen } from '@testing-library/react';
import CompanyProfilePage from 'pages/company-profile/ui';
import { useUserStore } from 'entities/user';
import { useCompanyStore } from 'entities/company';
import { renderPage } from 'shared/lib/tests/render-page';

// Разрываем циклическую зависимость (см. smoke-тесты страниц).
jest.mock('app/providers/routes', () => {
  const { AppRoutes, RoutePath, RouteName } = jest.requireActual('app/providers/routes/config/routes');
  return { AppRoutes, RoutePath, RouteName };
});

describe('CompanyProfilePage (smoke)', () => {
  beforeEach(() => {
    useUserStore.setState({ auth: true, user: { id: 'u1' } as never });
    useCompanyStore.setState({
      paramsCompany: { id: 'c1', companyName: 'Тестовая компания' } as never,
      storedCompany: { id: 'c1', companyName: 'Тестовая компания' } as never,
    });
  });

  it('рендерится без ошибок и показывает поля профиля', () => {
    renderPage(<CompanyProfilePage />);

    expect(screen.getByRole('heading', { name: 'Профиль компании' })).toBeInTheDocument();
    // MUI TextField рендерит label и legend с одинаковым текстом — ищем по ассоциации label.
    expect(screen.getByLabelText('Название компании')).toBeInTheDocument();
    expect(screen.getByLabelText('Ссылка для загрузки из гугл таблицы')).toBeInTheDocument();
  });
});
