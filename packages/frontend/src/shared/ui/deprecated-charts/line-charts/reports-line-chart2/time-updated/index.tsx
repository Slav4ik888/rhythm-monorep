import { FC } from 'react';
import { MDBox, MDTypography } from '../../../../mui-design-components';
import { CustomTheme, useUIConfiguratorController } from 'app/providers/theme';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { pxToRem, rgbaFromHex } from '../../../../../styles';



interface Props {
  date   : string
  light? : boolean // Не понял для чего это, но в Navbar также
}


/** Показывает сколько прошло времени с прошлого обновления */
export const TimeUpdated: FC<Props> = ({ light = false, date }) => {
  const [configuratorState] = useUIConfiguratorController();
  const { mode } = configuratorState;
  const darkMode = mode === 'dark';

  // For Icon style
  const iconsStyle = ({ palette: { dark, white, text } }: CustomTheme) => ({
    width  : pxToRem(12),
    height : pxToRem(12),
    mt     : 0.15,
    mr     : 0.5,
    color  : () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (! light) {
        colorValue = darkMode ? rgbaFromHex(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });


  return (
    <MDBox display='flex' alignItems='center'>
      <AccessTimeIcon sx={(theme) => iconsStyle(theme as CustomTheme)} fontSize='small' />
      <MDTypography variant='button' color='text' fontWeight='light'>
        {date}
      </MDTypography>
    </MDBox>
  );
}
