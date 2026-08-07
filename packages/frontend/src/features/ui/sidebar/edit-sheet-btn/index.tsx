import { FC, memo, useCallback } from 'react';
import { useValue } from 'shared/lib/hooks';
import { SetSheetModalAsync as SetSheetdModal } from '../set-sheet-modal/index.async';
import { EditSheetBtnComponent } from './edit-sheet-btn-component';



interface Props {
  editId    : string
  isHover   : boolean
  isEdit    : boolean
  onSetEdit : (status: boolean) => void
}

export const EditSheetBtn: FC<Props> = memo(({ editId, isHover, onSetEdit }) => {
  const hookOpen = useValue();

  const handleEdit = useCallback(() => {
    onSetEdit(true);
    hookOpen.setOpen();
  }, [hookOpen, onSetEdit]);

  const handleClose = useCallback(() => {
    onSetEdit(false);
    hookOpen.setClose();
  }, [hookOpen, onSetEdit]);


  return (
    <>
      <EditSheetBtnComponent
        isHover = {isHover}
        onClick = {handleEdit}
      />
      {
        hookOpen.open && (
          <SetSheetdModal
            editId   = {editId}
            hookOpen = {hookOpen}
            onClose  = {handleClose}
          />
        )
      }
    </>
  )
});
