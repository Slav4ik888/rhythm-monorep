import { FC, memo } from 'react';
import { CustomTheme, useTheme } from 'app/providers/theme';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { f, getTypography } from '../../../styles';
import { Divider } from '../../mui-components';



const useStyles = (theme: CustomTheme, view?: boolean) => {
  const { breakpoints, palette: { configurator } } = theme;
  const { size } = getTypography(theme);

  return {
    root: {
      ...f('c'),
    },
    row: {
      ...f('-fs-sb'),
      pb : 0.5,
      mb : 3,
    },
    titleBox: {
      ...f('c'),
      alignItems : view ? 'center' : 'left',
      width      : '100%',
    },
    title: {
      fontSize : size.xl, // `${size.lg} !important`,
      color    : configurator.title.headerColor,
      mb       : 1,

      [breakpoints.up('sm')]: {
        fontSize: size['2xl'], // `${size.lg} !important`,
      },
    },
    subtitle: {
      fontSize : size.sm,
      color    : configurator.title.headerSubtitle,

      [breakpoints.up('sm')]: {
        fontSize: size.md,
      },
    },
    icon: {
      fontSize    : `${size.lg} !important`,
      color       : configurator.title.headerIcon,
      stroke      : 'currentColor',
      strokeWidth : '1px',
      cursor      : 'pointer',
      // transform   : 'translateY(5px)', // Сдвинуть вниз
    }
  }
};


interface Props {
  ui?     : boolean // UI-configurator
  view?   : boolean // ViewItem-configurator
  onClose : () => void
}

export const ConfiguratorMainHeader: FC<Props> = memo(({ ui, view, onClose }) => {
  const sx = useStyles(useTheme(), view);


  if (! ui && ! view) return null;

  return (
    <Box sx={sx.root}>
      <Box sx={sx.row}>
        <Box sx={sx.titleBox}>
          <Typography sx={sx.title}>
            {`Настройк${ui ? 'и интерфейса' : 'а элементов'}`}
          </Typography>
          {
            ui && (
              <Typography sx={sx.subtitle}>
                Подберите для себя удобные опции.
              </Typography>
            )
          }
        </Box>

        <IconButton color='inherit' onClick={onClose}>
          <CloseIcon sx={sx.icon} fontSize='small' />
        </IconButton>
      </Box>

      <Divider />
    </Box>
  )
});
