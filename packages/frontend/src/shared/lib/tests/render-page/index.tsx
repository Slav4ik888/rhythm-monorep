// packages/frontend/src/shared/lib/tests/render-page/index.tsx
// Обёртка для smoke-тестов страниц: собирает светлую тему как в приложении
// и оборачивает в MemoryRouter (для useNavigate в лейаутах и кнопках).

import { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { customPalette as customPaletteLight } from 'app/providers/theme/model/themes/light-custom-palette';
import { gradients as gradientsLight } from 'app/providers/theme/model/themes/light-gradients';
import { borders } from 'app/providers/theme/model/themes/base/borders';

const muiTheme = createTheme();

// Собираем светлую тему так же, как это делает getThemeByName в приложении:
// customPalette + gradients + borders. В MUI v9 нет theme.borders по умолчанию,
// а MDButton читает theme.borders.borderRadius — без него падает на деструктуризации.
const theme = {
  ...muiTheme,
  borders: { ...borders },
  palette: {
    ...muiTheme.palette,
    ...customPaletteLight,
    gradients: gradientsLight,
  },
} as Theme & { borders: typeof borders };

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
