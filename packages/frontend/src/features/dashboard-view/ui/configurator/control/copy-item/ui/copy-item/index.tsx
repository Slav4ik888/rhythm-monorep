import { FC, memo, useCallback } from 'react';
import { ActivatedCopiedType, useDashboardViewActions } from 'entities/dashboard-view';
import { CopyViewItemComponent } from './component';



interface Props {
  type: ActivatedCopiedType
}

/**
 * Активация текущего элемента для копирования.
 * Затем нужно тыкнуть на элемент в который этот будет скопирован
 */
export const CopyViewItem: FC<Props> = memo(({ type }) => {
  const { selectedId, activatedCopied, setActiveCopied, clearActivatedCopied } = useDashboardViewActions();

  const handleToggle = useCallback(() => {
    if (activatedCopied) clearActivatedCopied()
    else setActiveCopied({ type, id: selectedId })
  }, [type, selectedId, activatedCopied, setActiveCopied, clearActivatedCopied]);


  return (
    <CopyViewItemComponent
      type        = {type}
      selectedId  = {selectedId}
      activatedId = {activatedCopied?.id}
      onToggle    = {handleToggle}
    />
  )
});
