import { FC, memo, useCallback } from 'react';
import { useValue } from 'shared/lib/hooks';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { SelectIconsModal } from '../select-icons-modal';
import { SelectedIcon } from '../selected-icon';



export const SelectIconRow: FC = memo(() => {
  const hookOpen = useValue();

  const handleAdd = useCallback(() => {
    hookOpen.setOpen();
  }, [hookOpen]);


  return (
    <RowWrapperTitle
      boldTitle
      title     = 'Selected icon'
      toolTitle = 'Выберите подходящую иконку'
    >
      <SelectedIcon onClick={handleAdd} />
      {
        hookOpen.open && <SelectIconsModal hookOpen={hookOpen} />
      }
    </RowWrapperTitle>
  )
});
