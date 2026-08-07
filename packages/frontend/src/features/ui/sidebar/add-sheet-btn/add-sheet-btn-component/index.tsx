import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { Tooltip } from 'shared/ui/tooltip';
import { CustomTheme, useUIConfiguratorController } from 'app/providers/theme';
// eslint-disable-next-line no-restricted-imports
import { alpha } from '@mui/material';



interface Props {
  onClick: () => void
}


export const AddSheetBtnComponent: FC<Props> = memo(({ onClick }) => {
  const [configuratorState] = useUIConfiguratorController();
  const { sidebarMini } = configuratorState;

  return (
    <Tooltip title='Добавить новый лист'>
      <Box
        sx={(theme) => ({
          ...f('-c-c'),
          cursor       : 'pointer',
          gap          : 0.5,
          my           : 1,
          mx           : 2,
          p            : 1,
          transition : theme.transitions.create(['color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            '& > svg': {
              color: alpha((theme as CustomTheme).palette.text.main, 0.5),
            },
            '& > p': {
              color: alpha((theme as CustomTheme).palette.text.main, 0.5),
            }
          },
        })}
        onClick={onClick}
      >
        <AddIcon
          sx={{
            fontSize : '1rem',
            color    : 'text.light',
            mt       : '2px'
          }}
        />
        {
          ! sidebarMini && <Typography
            sx={{
              fontSize : '0.9rem',
              color    : 'text.light'
            }}
          >
            добавить лист
          </Typography>
        }
      </Box>
    </Tooltip>
  )
});
