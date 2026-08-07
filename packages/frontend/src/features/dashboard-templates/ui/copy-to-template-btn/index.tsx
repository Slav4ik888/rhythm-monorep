import { FC, memo, useCallback } from 'react';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import { ActivatedCopiedType } from 'entities/dashboard-view';
import { AddBtn } from 'shared/ui/configurators-components';
import { useTheme } from 'app/providers/theme';
import { useTemplateActions } from '../../model/hooks/use-template-actions';



interface Props {
  type: ActivatedCopiedType
}

/** Кнопка копирования выбранного SelectedItem в шаблоны */
export const CopyToTemplatesBtn: FC<Props> = memo(({ type }) => {
  const { createTemplate } = useTemplateActions();

  const theme = useTheme();
  const isAll = type === 'copyItemsAll';


  const handleCreateTemplate = useCallback(() => {
    createTemplate(type);
  },
    [type, createTemplate]
  );


  return (
    <AddBtn
      toolTitle = {
        `Добавить ${isAll ? '' : 'только'} этот элемент ${isAll ? '(со всеми вложенными элементами) ' : ''}в "Шаблоны"`
      }
      title     = {isAll ? 'All' : '1'}
      color     = {theme.palette.template.color}
      startIcon = {CollectionsBookmarkIcon}
      onClick   = {handleCreateTemplate}
    />
  )
});
