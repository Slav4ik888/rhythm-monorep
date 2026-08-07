import { FC, memo, useCallback } from 'react';
import { useDashboardTemplates, isThisTemplate } from 'entities/dashboard-templates';
import Box from '@mui/material/Box';
import { TemplateItemContainer } from './template-item';
import { f } from 'shared/styles';
import { CustomTheme } from 'app/providers/theme';
import { useUI } from 'entities/ui';



/** Контейнер с шаблонами */
export const TemplatesContainer: FC = memo(() => {
  const { setWarningMessage } = useUI();
  const { templates, entities, isUnsaved, selectedId, setSelectedId } = useDashboardTemplates();


  const handleClick = useCallback((id: string) => {
    if (isUnsaved && ! isThisTemplate(entities, selectedId, id)) {
      return setWarningMessage('Для выбора другого элемента, сохраните или отмените изменения');
    }
    setSelectedId(id);
  }, [isUnsaved, entities, selectedId, setSelectedId, setWarningMessage]);


  return (
    <Box
      sx={(theme) => ({
        ...f('c'),
        width     : '100%',
        overflowX : 'scroll',
        background : (theme as CustomTheme).palette.background.paperLight,
        mr        : 2
      })}
    >
      {
        templates.map((template) => (
          <TemplateItemContainer
            key      = {template.id}
            template = {template}
            onClick  = {handleClick}
          />
        ))
      }
    </Box>
  )
});
