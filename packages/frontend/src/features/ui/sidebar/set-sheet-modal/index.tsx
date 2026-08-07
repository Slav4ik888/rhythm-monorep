import { FC, memo, useCallback, useEffect, MouseEvent, useState } from 'react';
import { DialogInfo } from 'shared/ui/dialogs';
import { UseValue } from 'shared/lib/hooks';
import { SetSheetActions as Actions } from './actions';
import { SetSheetContent as Content } from './content';
import { DefaultIconId } from 'shared/lib/icons';
import { getSheetById, useCompany } from 'entities/company';



interface Props {
  hookOpen : UseValue<any>
  editId?  : string  // sheetId if edit
  onClose? : () => void
}


const SetSheetModal: FC<Props> = memo(({ hookOpen: O, editId, onClose }) => {
  const { paramsSheets } = useCompany();
  const [sheetIconId, setSheetIconId] = useState<DefaultIconId | null>(null);
  const [sheetTitle, setSheetTitle] = useState<string>(() => getSheetById(
    paramsSheets, editId || '')?.title || ''
  );


  useEffect(() => {
    if (editId) {
      const sheet = getSheetById(paramsSheets, editId);
      if (sheet) {
        setSheetIconId(sheet?.iconId ?? null);
        setSheetTitle(sheet?.title ?? '');
      }
    }
  }, [editId, paramsSheets]);


  const handlerClose = useCallback(() => {
    O.setClose();
    onClose && onClose();
  }, [O, onClose]);


  const handlerChangeTitle = useCallback((e: MouseEvent, v: string | number) => {
    setSheetTitle(v as string);
  }, []);



  return (
    <DialogInfo
      hookOpen = {O}
      title    = 'Название листа'
      maxWidth = 'xs'
      onClose  = {handlerClose}
    >
      <Content
        sheetTitle     = {sheetTitle}
        selectedIconId = {sheetIconId}
        onSelectIcon   = {setSheetIconId}
        onChangeTitle  = {handlerChangeTitle}
      />
      <Actions
        editId         = {editId}
        onClose        = {handlerClose}
        selectedIconId = {sheetIconId}
        sheetTitle     = {sheetTitle}
      />
    </DialogInfo>
  )
});

export default SetSheetModal;
