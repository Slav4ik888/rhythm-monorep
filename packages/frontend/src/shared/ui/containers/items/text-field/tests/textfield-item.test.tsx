import '@testing-library/jest-dom';
import { TextfieldItem } from '..';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { useGroup } from '../../../../../lib/hooks';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import { customPalette as themeLight } from 'app/providers/theme/model/themes/light-custom-palette';

const theme = createTheme(themeLight as ThemeOptions);


const MockGroupItem = {
  id    : 'id123',
  field : 'Some field'
};


describe('TextfieldItem', () => {
  it('Placeholder right show', () => {
    const { result } = renderHook(() => useGroup(MockGroupItem));

    const { debug } = render(
      <ThemeProvider theme={theme}>
        <TextfieldItem
          group       = {result.current}
          scheme      = 'field'
          label       = 'Some label'
          placeholder = 'Some placeholder'
        />
      </ThemeProvider>
    );

    debug();
    const inputText = screen.getByPlaceholderText('Some placeholder');

    expect(inputText).toBeInTheDocument();
  })
});

// npm run test:unit textfield-item.test.tsx -- --watch
