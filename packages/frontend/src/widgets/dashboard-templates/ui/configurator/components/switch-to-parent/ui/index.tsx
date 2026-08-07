import { FC, memo, useCallback } from 'react';
import Box from '@mui/material/Box';
import { Tooltip } from 'shared/ui/tooltip';
import { MDButton } from 'shared/ui/mui-design-components';
import { CustomTheme } from 'app/providers/theme';
import SelectedIcon from '@mui/icons-material/TabUnselected';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { useDashboardTemplates } from 'entities/dashboard-templates';



/**
 * Переключение на родительский элемент в Template
 * для тех случаев когда его размер совпадает с текущим
 */
export const SwitchToParentContainer: FC = memo(() => {
  const { selectedId, selectedTemplate, setSelectedId } = useDashboardTemplates();

  const handleClick = useCallback(() => {
    if (! selectedId
      || ! selectedTemplate
      || ! selectedTemplate?.viewItems?.[selectedId].parentId
    ) return

    setSelectedId(selectedTemplate?.viewItems?.[selectedId].parentId);
  }, [selectedId, selectedTemplate, setSelectedId]);


  return (
    <RowWrapperTitle
      boldTitle
      title     = 'Переключиться'
      toolTitle = 'Переключние на родительский элемент'
    >
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
    </RowWrapperTitle>
  )
});
