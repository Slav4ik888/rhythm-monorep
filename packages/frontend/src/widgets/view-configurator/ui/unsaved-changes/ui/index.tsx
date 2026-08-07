import { FC, memo, useCallback, useEffect } from 'react';
import { isEmpty, isNotEmpty, updateObject } from 'shared/helpers/objects';
import { useCompany } from 'entities/company';
import { isChangedViewItem } from '../model/utils';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { UnsavedChangesComponent } from 'shared/ui/configurators-components';
import { useDashboardViewServices } from 'features/dashboard-view/model/hooks/use-dashboard-view-services';



export const UnsavedChanges: FC = memo(() => {
  const { paramsCompanyId, paramsChangedCompany, serviceUpdateCompany, cancelParamsCustomSettings } = useCompany();
  const {
    loading, selectedId, changedViewItem, isUnsaved, selectedItem,
    setIsUnsaved, serviceUpdateViewItems, cancelUpdateViewItem
  } = useDashboardViewServices();


  useEffect(() => {
    isChangedViewItem(selectedId, paramsChangedCompany, changedViewItem, true)
      ? setIsUnsaved(true)
      : setIsUnsaved(false);
  },
    [selectedId, paramsChangedCompany, changedViewItem, setIsUnsaved]
  );


  const handleCancel = useCallback(() => {
    if (isNotEmpty(paramsChangedCompany)) cancelParamsCustomSettings(); /** Отменить изменившиеся customSettings */
    if (isNotEmpty(changedViewItem)) cancelUpdateViewItem(); /** Отменить изменившиеся поля | стили */
  },
    [paramsChangedCompany, changedViewItem, cancelParamsCustomSettings, cancelUpdateViewItem]
  );


  const handleClick = useCallback(() => {
    if (isNotEmpty(paramsChangedCompany)) serviceUpdateCompany({ id: paramsCompanyId, ...paramsChangedCompany }); /** Сохраняем изменившиеся customSettings */
    if (isEmpty(changedViewItem)) return
    /** Сохраняем изменившиеся поля | стили */
    const viewItem = {
      id: selectedId,
      bunchId: selectedItem.bunchId,
      ...changedViewItem
    };
    serviceUpdateViewItems({
      companyId         : paramsCompanyId,
      viewItems         : [viewItem],
      newStoredViewItem : updateObject(selectedItem, viewItem),
      bunchUpdatedMs    : Date.now(),
    });
  },
    [
      paramsCompanyId, selectedId, paramsChangedCompany, changedViewItem, selectedItem,
      serviceUpdateViewItems, serviceUpdateCompany
    ]
  );


  const handleConsole = useCallback(() => {
    if (isNotEmpty(paramsChangedCompany)) {
      __devLog('UnsavedChanges', 'paramsChangedCompany:', '--force');
      __devLog('UnsavedChanges', JSON.stringify(paramsChangedCompany, null, 2), '--force');
    }
    if (isNotEmpty(changedViewItem)) {
      __devLog('UnsavedChanges', 'changedViewItem:', '--force');
      __devLog('UnsavedChanges', JSON.stringify(changedViewItem, null, 2), '--force');
    }
  },
    [paramsChangedCompany, changedViewItem]
  );


  if (! isUnsaved) return null;


  return (
    <UnsavedChangesComponent
      loading         = {loading}
      changedCompany  = {paramsChangedCompany}
      changedViewItem = {changedViewItem}
      onClick         = {handleClick}
      onConsole       = {handleConsole}
      onCancel        = {handleCancel}
    />
  )
});
