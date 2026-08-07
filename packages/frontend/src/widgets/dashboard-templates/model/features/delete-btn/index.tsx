import { FC, memo, useCallback } from 'react';
import { useDashboardTemplates } from 'entities/dashboard-templates';
import { DeleteButton } from 'shared/ui/buttons/delete-button';
import { useTheme, CustomTheme } from 'app/providers/theme';



type TypeType = 'template' | 'viewItem'

const useStyles = (theme: CustomTheme, type: TypeType) => {
  if (type !== 'template') return {}

  return {
    icon: {
      color: theme.palette.template.color,
    }
  }
};


interface Props {
  type: TypeType
}

/** Конфигуратор шаблонов */
export const DeleteBtn: FC<Props> = memo(({ type }) => {
  const sx = useStyles(useTheme(), type);
  const {
    isMainItem, selectedTemplate, deleteSelectedViewItem, serviceDeleteTemplate
  } = useDashboardTemplates();


  const handleDelete = useCallback(() => {
    if (type === 'template' && selectedTemplate?.id) {
      serviceDeleteTemplate({
        bunchUpdatedMs : Date.now(),
        templateId     : selectedTemplate.id,
        bunchId        : selectedTemplate.bunchId
      });
    }
    else {
      deleteSelectedViewItem();
    }
  },
    [type, selectedTemplate, serviceDeleteTemplate, deleteSelectedViewItem]
  );


  return (
    <DeleteButton
      icon
      toolTitle         = {`Удалить ${type === 'template' ? 'весь шаблон' : 'этот элемент'}`}
      disabled          = {type === 'viewItem' && isMainItem}
      toolTitleDisabled = 'Элемент является корневым, можно удалить только весь шаблон'
      sx                = {sx}
      onDel             = {handleDelete}
    />
  )
});
