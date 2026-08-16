import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getThemeByName } from 'app/providers/theme/utils/get-theme-by-name';
import type { UIConfiguratorProviderState } from 'app/providers/theme';
import { DashboardBoxContainer } from '..';

// Собираем тему так же, как UIConfiguratorProvider в приложении,
// чтобы palette.gradients был доступен внутри компонента.
const muiTheme = createTheme();
const theme = createTheme(
  getThemeByName(muiTheme, {
    mode: 'light',
    navbarColor: 'navbar_white',
    sidebarColor: 'sidebar_black',
  } as unknown as UIConfiguratorProviderState),
);

describe('DashboardBoxContainer', () => {
  it('отображает заголовок и содержимое', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <DashboardBoxContainer title='Заголовок блока'>
          <div>Содержимое блока</div>
        </DashboardBoxContainer>
      </ThemeProvider>,
    );

    expect(getByText('Заголовок блока')).toBeInTheDocument();
    expect(getByText('Содержимое блока')).toBeInTheDocument();
  });

  it('отображает только содержимое без заголовка', () => {
    const { queryByText, getByText } = render(
      <ThemeProvider theme={theme}>
        <DashboardBoxContainer>
          <div>Только содержимое</div>
        </DashboardBoxContainer>
      </ThemeProvider>,
    );

    expect(getByText('Только содержимое')).toBeInTheDocument();
    expect(queryByText('Заголовок блока')).not.toBeInTheDocument();
  });
});
