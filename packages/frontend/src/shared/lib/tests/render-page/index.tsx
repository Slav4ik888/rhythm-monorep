// packages/frontend/src/shared/lib/tests/render-page/index.tsx
// Обёртка для smoke-тестов страниц: собирает светлую тему как в приложении
// и оборачивает в MemoryRouter (для useNavigate в лейаутах и кнопках).

import { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getThemeByName } from 'app/providers/theme/utils/get-theme-by-name';
import type { UIConfiguratorProviderState } from 'app/providers/theme';

const muiTheme = createTheme();

// Собираем тему так же, как UIConfiguratorProvider в приложении: getThemeByName
// объединяет кастомную палитру, темы sidebar/navbar, градиенты, borders и breakpoints.
// Упрощённая сборка (только customPalette) не подходит: Navbar читает palette.navbar,
// Sidebar — palette.sidebar, без них падает на деструктуризации.
// Как в UIConfiguratorProvider: результат getThemeByName дополнительно прогоняется
// через createTheme, чтобы MUI дополнил breakpoints.up/down/between и прочие методы.
const theme = createTheme(
  getThemeByName(muiTheme, {
    mode: 'light',
    navbarColor: 'navbar_white',
    sidebarColor: 'sidebar_black',
  } as unknown as UIConfiguratorProviderState),
);

/**
 * Рендер страницы в контексте темы и роутера.
 * Используется в smoke-тестах статических страниц.
 */
export const renderPage = (ui: ReactElement): RenderResult =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>,
  );
