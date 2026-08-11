// packages/frontend/src/shared/ui/pages/action-container/action-main/tests/action-main-login.test.tsx

import { fireEvent } from '@testing-library/react';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import { customPalette as themeLight } from 'app/providers/theme/model/themes/light-custom-palette';
import { ActionMain } from '..';
import { setupRender } from 'shared/lib/tests/setup-render';

const theme = createTheme(themeLight as ThemeOptions);

describe('ActionMain', () => {
  const generalError = 'General error';

  it('AuthType.LOGIN, empty', async () => {
    const onSubmit = jest.fn();

    const { user, getByRole, getByText } = setupRender(
      <ThemeProvider theme={theme}>
        <ActionMain type='login' errors={{}} loading={false} disabled={false} onSubmit={onSubmit} />
      </ThemeProvider>,
    );

    // debug();

    // Check ErrorBox in the document
    expect(document.querySelector('[data-testid="ErrorBox"]')).not.toBeInTheDocument();

    // Check button in the document
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Войти')).toBeInTheDocument();

    // Check user click called
    await user.click(getByRole('button', { name: /Войти/i }));
    expect(onSubmit).toBeCalledTimes(1);

    // Not be CircularProgress in the document
    expect(document.querySelector('#CircularId')).not.toBeInTheDocument();
  });

  // --------------------------------------------------------------------------------------------------

  it('AuthType.LOGIN, with error & loading', async () => {
    const onSubmit = jest.fn();

    const { user, debug, getByRole, getByText } = setupRender(
      <ThemeProvider theme={theme}>
        <ActionMain type='login' errors={{ general: generalError }} loading disabled={false} onSubmit={onSubmit} />
      </ThemeProvider>,
    );

    // debug();

    // Check ErrorBox in the document
    expect(getByText(generalError)).toBeInTheDocument();
    expect(document.querySelector('[data-testid="ErrorBox"]')).toBeInTheDocument();

    // Check button in the document
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Войти')).toBeInTheDocument();

    // Check user click called
    getByRole('button', { name: /Войти/i }).click();
    // fireEvent.click(getByText('Войти'));
    expect(onSubmit).toBeCalledTimes(0);

    // Find CircularProgress in the document
    expect(document.querySelector('#CircularId')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------------------------------

  it('AuthType.LOGIN, disabled', async () => {
    const onSubmit = jest.fn();

    const { user, debug, getByRole, getByText } = setupRender(
      <ThemeProvider theme={theme}>
        <ActionMain type='login' disabled errors={{}} loading={false} onSubmit={onSubmit} />
      </ThemeProvider>,
    );

    debug();

    // Check ErrorBox in the document
    expect(document.querySelector('[data-testid="ErrorBox"]')).not.toBeInTheDocument();

    // Check button in the document
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Войти')).toBeInTheDocument();

    // Check user click called
    // getByRole('button', { name: /Войти/i }).click();
    fireEvent.click(getByText('Войти'));
    expect(onSubmit).toBeCalledTimes(0);

    // Find CircularProgress in the document
    expect(document.querySelector('#CircularId')).not.toBeInTheDocument();
  });
});

// npm run test:unit action-main.login.test.tsx -- --watch
