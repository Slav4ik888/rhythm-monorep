import { FC, memo, useCallback } from 'react';
import { useDashboardTemplates } from 'entities/dashboard-templates';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { Tooltip } from 'shared/ui/tooltip';
import { DeleteBtn } from '../../../../model/features/delete-btn';
import { styleAtom } from '../styles';
import { useTheme } from 'app/providers/theme';



export const TemplateIdContainer: FC = memo(() => {
  const theme = useTheme();
  const { selectedId, selectedTemplate, activateMainViewItem } = useDashboardTemplates();

  const handleClick = useCallback(() => {
    activateMainViewItem();
  }, [activateMainViewItem]);


  return (
    <RowWrapperTitle
      boldTitle
      title     = 'Id шаблона'
      toolTitle = 'Id шаблона'
      sx        = {{ title: { color: theme.palette.template.color } }}
    >
      <Box sx={{ ...f('-c'), gap: 1 }}>
        <Tooltip title = 'Нажмите, чтобы выделить корневой элемент'>
          <Box
            onClick = {handleClick}
            sx      = {{ ...styleAtom, cursor: 'pointer' }}
          >
            {selectedTemplate?.id}
          </Box>
        </Tooltip>
        {selectedId && <DeleteBtn type='template' />}
      </Box>
    </RowWrapperTitle>
  )
});
