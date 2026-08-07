import { FC, memo, useCallback } from 'react';
import { useCompany } from 'entities/company';
import { DeleteButton } from 'shared/ui/buttons/delete-button';
import { usePages } from 'shared/lib/hooks';
import { useDashboardViewState } from 'entities/dashboard-view';
import { isSheetNotEmpty } from 'entities/company/utils';
import { useUI } from 'entities/ui';



interface Props {
  editId  : string  // sheetId if edit
  onClose : () => void
}

export const DeleteSheetBtn: FC<Props> = memo(({ editId, onClose }) => {
  const { paramsCompanyId, serviceDeleteSheet } = useCompany();
  const { viewItems } = useDashboardViewState();
  const { dashboardSheetId } = usePages();
  const { setWarningMessage } = useUI();


  const handleDel = useCallback(() => {
    // Нельзя удалять пока есть вложенные ViewItems
    if (isSheetNotEmpty(viewItems, dashboardSheetId)) return setWarningMessage(
      'Нельзя удалить вкладку, пока есть вложенные элементы'
    );

    serviceDeleteSheet({
      companyId : paramsCompanyId,
      sheetId   : editId
    });
    onClose();
  },
    [editId, paramsCompanyId, viewItems, dashboardSheetId, serviceDeleteSheet, onClose, setWarningMessage]
  );


  return (
    <DeleteButton
      icon
      toolTitle = 'Удалить этот лист'
      onDel     = {handleDel}
    />
  )
});
function setWarningMessage(arg0: string): any {
  throw new Error('Function not implemented.');
}
