import { memo, FC, useCallback } from 'react';
import { Button } from 'shared/ui/buttons';
import { useCompany } from 'entities/company';
import { DefaultIconId } from 'shared/lib/icons';
import { useSheetSubmit } from '../model/hooks';



interface Props {
  editId         : string | undefined // sheetId if edit
  sheetTitle     : string
  selectedIconId : DefaultIconId | null
  onClose        : () => void
}


export const SetSheetSubmitBtn: FC<Props> = memo(({ editId, selectedIconId, sheetTitle, onClose }) => {
  const { disabled, submitChanges } = useSheetSubmit(editId, sheetTitle, selectedIconId);
  const { loading } = useCompany();

  const handlerSubmit = useCallback(() => {
    const result = submitChanges();
    if (result) onClose();
  },
    [submitChanges, onClose]
  );


  return (
    <Button
      id       = 'save-sheet-btn'
      loading  = {loading}
      disabled = {disabled}
      variant  = 'outlined'
      text     = {editId ? 'Сохранить' : 'Создать'}
      onClick  = {handlerSubmit}
    />
  )
});
