// packages/frontend/src/widgets/dashboard-view/panel/tests/panel.test.tsx
// Smoke-тест панели добавления элементов дашборда.

import { screen } from '@testing-library/react';
// Импортируем напрямую из leaf-модуля: баррель widgets/dashboard-view тянет
// body-content → dashboard-render → highcharts (падает в jsdom на CSS.supports).
import { DashboardBodyPanel } from 'widgets/dashboard-view/panel';
import { renderPage } from 'shared/lib/tests/render-page';

// Изолируем тяжёлые коллабораторы — их логика покрыта отдельно.
jest.mock('features/dashboard-view', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AddNewViewItem: ({ component: Component }: { component: any }) => <Component onClick={() => {}} />,
}));

jest.mock('widgets/dashboard-templates', () => ({
  OpenTemplatesBtn: () => null,
}));

jest.mock('entities/dashboard-templates', () => ({
  useCanTemplateToDashboard: () => ({ canAddFromTemplate: false }),
}));

describe('DashboardBodyPanel (smoke)', () => {
  it('рендерится без ошибок и показывает кнопки добавления элементов', () => {
    renderPage(<DashboardBodyPanel />);

    expect(screen.getByText('Box')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
