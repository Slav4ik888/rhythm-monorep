import { useTheme } from 'app/providers/theme';
import { getTypography } from 'shared/styles';



export const useSxNavbarIconButton = () => {
  const theme = useTheme();
  const { breakpoints } = theme;

  return {
    px: 1,

    '& .material-icons, .material-icons-round': {
      fontSize: `${getTypography(theme).size.xl} !important`,
    },

    '& .MuiTypography-root': {
      display: 'none',

      [breakpoints.up('sm')]: {
        display    : 'inline-block',
        lineHeight : 1.2,
        ml         : 0.5,
      },
    },
  }
};


/** Styles for the navbar icons */
export const useSxNavbarIconsStyle = () => {
  const theme = useTheme();
  const { palette: { navbar, white, text, mode } } = theme;
  const darkMode = mode === 'dark';

  return {
    color: () => {
      const colorValue = navbar.color;

      // if (navbarTransparent && ! light) {
      //   colorValue = darkMode ? rgbaFromHex(text.main, 0.6) : text.main;
      // }

      return colorValue;
    },
  }
};
