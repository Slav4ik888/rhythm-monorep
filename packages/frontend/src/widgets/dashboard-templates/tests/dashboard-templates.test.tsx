// packages/frontend/src/widgets/dashboard-templates/tests/dashboard-templates.test.tsx
// Smoke-тесты виджета шаблонов дашборда.

import { screen, fireEvent } from '@testing-library/react';
import { renderPage } from 'shared/lib/tests/render-page';

import { useDashboardTemplates } from 'entities/dashboard-templates';
import { OpenTemplatesBtn } from 'widgets/dashboard-templates/model/features/open-template-btn';
import { DashboardTemplates } from 'widgets/dashboard-templates/ui/templates';

jest.mock('entities/dashboard-templates', () => ({
  useDashboardTemplates: jest.fn(),
}));

// Изолируем тяжёлый рендер дашборда — его логика покрыта отдельно.
jest.mock('widgets/dashboard-render', () => ({
  DashboardRender: () => null,
}));

describe('widgets/dashboard-templates (smoke)', () => {
  const mockSetOpened = jest.fn();
  const mockServiceGetBunchesUpdated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDashboardTemplates as jest.Mock).mockReturnValue({
      opened: false,
      setOpened: mockSetOpened,
      templates: [],
      entities: {},
      isUnsaved: false,
      selectedId: undefined,
      setSelectedId: jest.fn(),
      serviceGetBunchesUpdated: mockServiceGetBunchesUpdated,
    });
  });

  it('OpenTemplatesBtn рендерит кнопку Templates', () => {
    renderPage(<OpenTemplatesBtn />);

    expect(screen.getByText('Templates')).toBeInTheDocument();
  });

  it('OpenTemplatesBtn при клике открывает окно шаблонов', () => {
    renderPage(<OpenTemplatesBtn />);

    fireEvent.click(screen.getByText('Templates'));

    expect(mockSetOpened).toHaveBeenCalledWith(true);
  });

  it('DashboardTemplates рендерится и запрашивает актуальные bunchesUpdated', () => {
    renderPage(<DashboardTemplates />);

    expect(mockServiceGetBunchesUpdated).toHaveBeenCalledTimes(1);
  });
});
