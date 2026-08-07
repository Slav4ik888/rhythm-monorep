import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f, getTypography } from 'shared/styles';
import { CustomTheme, useTheme } from 'app/providers/theme';
import { GotoDemoBtn } from 'widgets/demo/goto-demo-btn';
// import s from './styles.module.scss';



const useStyles = (theme: CustomTheme) => {
  const { size } = getTypography(theme);

  return {
    root: {
      ...f('c-c-c'),
      fontFamily : 'Montserrat-SemiBold',
      fontSize   : size['3xl'],
      gap        : 8,

      [theme.breakpoints.down('sm')]: {
        fontSize : size.xl,
        p        : 1,
      },
    }
  }
};


/** Главная страница неавторизованного пользователя */
const RootNotAuthContainer: FC = memo(() => {
  const sx = useStyles(useTheme());

  return (
    <Box sx={sx.root}>
      Настрой «Ритм» своей компании!
      <GotoDemoBtn />
    </Box>
  );
});

export default RootNotAuthContainer;
