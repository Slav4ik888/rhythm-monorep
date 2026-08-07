import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { Tooltip } from 'shared/ui/tooltip';
import { MDButton } from 'shared/ui/mui-design-components';
import { CustomTheme, useTheme } from 'app/providers/theme';
import { pxToRem } from 'shared/styles';
import CopyIcon from '@mui/icons-material/ContentCopy';



const useStyles = (theme: CustomTheme) => ({
  helperText: {
    position  : 'absolute',
    top       : '100%',
    right     : 0,
    width     : pxToRem(390),
    maxWidth  : pxToRem(390),
    fontSize  : '0.8rem',
    color     : theme.palette.error.dark,
  },
  icon: {
    color    : theme.palette.dark.main,
    fontSize : '20px',
  },
  prefix: {
    position  : 'absolute',
    top       : 0,
    right     : pxToRem(9),
    fontSize  : '0.7rem',
    fontWeight: 900,
    color     : '#757575',
  },
});


interface Props {
  selectedId  : string
  activatedId : string | undefined // Id of the activated item, нужен, чтобы вывести подсказку что сделать с выбранным элементом
  onToggle    : () => void
}

export const CopyStylesViewItemComponent: FC<Props> = memo(({ selectedId, activatedId, onToggle }) => {
  const sx = useStyles(useTheme());

  return (
    <Box sx={{ position: 'relative' }}>
      {
        selectedId && selectedId === activatedId
          ? <Box sx={sx.helperText}>
            Кликните на тот элемент, в который хотите поместить скопированный стиль.
            Для отмены - повторно нажмите на кнопку копирования.
          </Box>
          : null
      }
      <Tooltip title='Копировать стиль этого элемента'>
        <MDButton
          variant   = 'outlined'
          color     = 'dark'
          onClick   = {onToggle}
        >
          <CopyIcon sx={sx.icon} />
          <Box sx={sx.prefix}>
            Styles
          </Box>
        </MDButton>
      </Tooltip>
    </Box>
  )
});
