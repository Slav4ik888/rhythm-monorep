import { CustomTheme } from 'app/providers/theme';
import { f } from 'shared/styles';



export const useStyles = (theme: CustomTheme) => ({
  root: {
    position: 'fixed',
    ...f('-c-c'),
    flexDirection: { xs: 'column', sm: 'row' },
    bottom  : 0,
    zIndex  : 2000,
    width   : '100%',
    cursor  : 'pointer',
    backgroundColor: theme.palette.secondary.light,
    my : 0.5,
    m  : { xs: 0 },
    px : 4,
    p  : { xs: 2 }
  },
  form: {
    ...f('-c'),
    '& .MuiTypography-body1 ': {
      xs: { fontSize: '0.7rem' }
    }
  },
  btn: {
    root: {
      minWidth: 'max-content',
      fontSize: { xs: '0.7rem' },
      width: { xs: '100%', sm: 'max-content' },
      mt: { xs: 1, sm: 0 },
      mr: { xs: 0, sm: 0 },
      mb: { xs: 0, sm: 0 },
      ml: { xs: 0, sm: 1 }
    }
  }
});
