import { FC, memo, useCallback } from 'react';
import { useDashboardViewActions } from 'entities/dashboard-view';
import Box from '@mui/material/Box';
import { Tooltip } from 'shared/ui/tooltip';
import { MDButton } from 'shared/ui/mui-design-components';
import { CustomTheme } from 'app/providers/theme';
import SelectedIcon from '@mui/icons-material/TabUnselected';



/**
 * Переключение на родительский элемент
 * для тех случаев когда его размер совпадает с текущим
 */
export const SwitchToParentViewItem: FC = memo(() => {
  const { selectedItem, setSelectedId } = useDashboardViewActions();

  const handleClick = useCallback(() => {
    setSelectedId(selectedItem.parentId);
  }, [selectedItem, setSelectedId]);


  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title='Переключение на родительский элемент - если его размер совпадает с текущим элементов
       и с помощью курсора его нельзя выделить'>
        <MDButton
          variant   = 'outlined'
          color     = 'dark'
          onClick   = {handleClick}
        >
          <SelectedIcon
            sx={(theme) => ({
              color    : (theme as CustomTheme).palette.dark.main,
              fontSize : '20px',
            })}
          />
        </MDButton>
      </Tooltip>
    </Box>
  )
});
