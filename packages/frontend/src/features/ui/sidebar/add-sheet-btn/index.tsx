import { FC, memo, useCallback } from 'react';
import { useValue } from 'shared/lib/hooks';
import { SetSheetModalAsync as SetSheetdModal } from '../set-sheet-modal/index.async';
import { AddSheetBtnComponent } from './add-sheet-btn-component';



export const AddSheetBtn: FC = memo(() => {
  const hookOpen = useValue();

  const handleAdd = useCallback(() => {
    hookOpen.setOpen();
  }, [hookOpen]);


  return (
    <>
      <AddSheetBtnComponent onClick={handleAdd} />
      {
        hookOpen.open && <SetSheetdModal
          hookOpen = {hookOpen}
        />
      }
    </>
  )
});
