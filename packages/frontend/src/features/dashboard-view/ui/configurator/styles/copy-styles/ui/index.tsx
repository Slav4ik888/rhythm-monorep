import { FC, memo, useCallback } from 'react';
import { useDashboardViewActions } from 'entities/dashboard-view';
import { CopyStylesViewItemComponent } from './component';



/**
 * Копирование стилей текущего элемента.
 * Для этого его активируем, а затем тыкаем на элемент в который нужно вставить
 */
export const CopyStylesViewItemBtn: FC = memo(() => {
  const { selectedId, activatedCopied, setActiveCopied, clearActivatedCopied } = useDashboardViewActions();

  const handleToggle = useCallback(() => {
    if (activatedCopied) clearActivatedCopied()
    else setActiveCopied({ type: 'copyStyles', id: selectedId })
  }, [selectedId, activatedCopied, setActiveCopied, clearActivatedCopied]);


  return (
    <CopyStylesViewItemComponent
      selectedId  = {selectedId}
      activatedId = {activatedCopied?.id}
      onToggle    = {handleToggle}
    />
  )
});
