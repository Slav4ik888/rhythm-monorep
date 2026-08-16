import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { customPalette as themeLight } from 'app/providers/theme/model/themes/light-custom-palette';
import { CompanyTypeChip } from '..';

const theme = createTheme(themeLight as ThemeOptions);

describe('CompanyTypeChip', () => {
  it('отображает переданный label', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <CompanyTypeChip label='Общая' customSettings={{}} />
      </ThemeProvider>,
    );

    expect(getByText('Общая')).toBeInTheDocument();
  });

  it('отображает пустой chip при отсутствии label', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <CompanyTypeChip customSettings={{}} />
      </ThemeProvider>,
    );

    expect(container.querySelector('.MuiChip-root')).toBeInTheDocument();
  });
});
