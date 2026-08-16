// packages/frontend/src/widgets/ui-configurator/tests/ui-configurator.test.tsx
// Smoke-тест виджета конфигуратора темы.

import { screen } from '@testing-library/react';
import { UIConfigurator } from 'widgets/ui-configurator';
import { renderPage } from 'shared/lib/tests/render-page';

// Переопределяем глобальный мок из setup-tests: для этого теста конфигуратор открыт.
jest.mock('app/providers/theme/model/hooks/use-ui-configurator-controller', () => ({
  useUIConfiguratorController: () => [{ isOpenConfigurator: true }, jest.fn()],
}));

// Изолируем переключатели темы — их логика покрыта отдельно.
jest.mock('features/ui', () => ({
  PaletteModeSwitcher: () => null,
  SwitcherSidebarMini: () => null,
  SwitcherSidebarHidden: () => null,
  SwitcherSidebarColor: () => null,
}));

describe('UIConfigurator (smoke)', () => {
  it('рендерит секции конфигуратора, когда он открыт', () => {
    renderPage(<UIConfigurator />);

    expect(screen.getByText('Тема')).toBeInTheDocument();
    expect(screen.getByText('Боковая панель')).toBeInTheDocument();
  });
});
