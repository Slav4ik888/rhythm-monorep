import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f, getTypography } from 'shared/styles';
import { useCompany } from 'entities/company';
import { GotoDemoBtn } from 'widgets/demo/goto-demo-btn';
import { useTheme, CustomTheme } from 'app/providers/theme';



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

export const RootAuthComponent: FC = memo(() => {
  const sx = useStyles(useTheme());
  const { company } = useCompany();
  const companyName = company?.companyName ? ` "${company.companyName}"!` : '!';

  return (
    <Box sx={sx.root}>
      {`Ритм компании${companyName}`}
      <GotoDemoBtn />
    </Box>
  )
});
