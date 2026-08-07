import '@testing-library/jest-dom';
import { ErrorBox } from '..';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { customPalette as themeLight } from 'app/providers/theme/model/themes/light-custom-palette';



const theme = createTheme(themeLight as ThemeOptions);


describe('ErrorBox', () => {
  it('Get error text by field', () => {
    const errors = {
      anyField   : 'anyField text',
      errorField : 'errorField text'
    };

    const { getByText, container } = render(
      <ThemeProvider theme={theme}>
        <ErrorBox
          field  = 'errorField'
          sx     = {{}}
          errors = {errors}
        />
      </ThemeProvider>
    );

    expect(getByText('errorField text')).toBeInTheDocument();

    const boxes = container.getElementsByClassName('MuiBox-root');
    expect(boxes.length).toBe(2);
  });


  it('ErrorBox not be rendered', () => {
    const errors = {
      anyField   : 'anyField text'
    };

    const { debug, container } = render(
      <ThemeProvider theme={theme}>
        <ErrorBox
          field  = 'errorField'
          sx     = {{}}
          errors = {errors}
        />
      </ThemeProvider>
    );

    debug();

    const boxes = container.getElementsByClassName('MuiBox-root');
    expect(boxes.length).toBe(0);
  });
});

// npm run test:unit error-box.test.tsx -- --watch
