// packages/frontend/src/widgets/dashboard-data/dashboard-datebar/tests/dashboard-datebar.test.tsx
// Smoke-тест панели управления периодом и обновления данных дашборда.

import { screen } from '@testing-library/react';
import { DashboardDatebar } from 'widgets/dashboard-data';
import { renderPage } from 'shared/lib/tests/render-page';

// Изолируем фичи dashboard-data — их логика покрыта отдельно.
jest.mock('features/dashboard-data', () => ({
  PeriodType: () => <div>period-type-mock</div>,
  SetPeriodDate: () => null,
  DashboardRefreshButton: () => <button type='button'>refresh-mock</button>,
}));

describe('DashboardDatebar (smoke)', () => {
  it('рендерится без ошибок и показывает элементы управления периодом', () => {
    renderPage(<DashboardDatebar />);

    expect(screen.getByText('period-type-mock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'refresh-mock' })).toBeInTheDocument();
    expect(screen.getByText('Загрузите данные')).toBeInTheDocument();
  });
});
