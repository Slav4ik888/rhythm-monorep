import { FC, memo, useCallback } from 'react';
import { useDashboardViewActions } from 'entities/dashboard-view';
import Box from '@mui/material/Box';
import { CustomTheme, useTheme } from 'app/providers/theme';
import MoveIcon from '@mui/icons-material/MoveUp';
import { pxToRem } from 'shared/styles';
import { AddBtn } from 'shared/ui/configurators-components';
import { brown } from '@mui/material/colors';



const useStyles = (theme: CustomTheme) => ({
  helperText: {
    position  : 'absolute',
    top       : '100%',
    width     : pxToRem(400),
    maxWidth  : pxToRem(400),
    fontSize  : '0.8rem',
    color     : theme.palette.error.dark,
  }
});


/**
 * Перемещение элемента в другой элемент
 * для этого его активируем, а затем тыкаем на элемент в который нужно переместить
 */
export const MoveToAnotherItem: FC = memo(() => {
  const sx = useStyles(useTheme());
  const { selectedId, activatedMovementId, setActiveMovementId, clearActivatedMovementId } = useDashboardViewActions();

  const handleToggleActiveMovement = useCallback(() => {
    if (activatedMovementId) clearActivatedMovementId()
    else setActiveMovementId()
  }, [activatedMovementId, clearActivatedMovementId, setActiveMovementId]);


  return (
    <Box sx={{ position: 'relative' }}>
      {
        selectedId && selectedId === activatedMovementId
          ? <Box sx={sx.helperText}>
            Для перемещения этого элемента, кликните на тот элемент, в который хотите его переместить
          </Box>
          : null
      }
      <AddBtn
        toolTitle = 'Переместить этот элемент в другой'
        // color     = {brown[500]}
        startIcon = {MoveIcon}
        onClick   = {handleToggleActiveMovement}
      />
    </Box>
  )
});
