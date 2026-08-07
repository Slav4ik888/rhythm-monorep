import { FC, memo, useCallback } from 'react';
import MoveIcon from '@mui/icons-material/MoveUp';
import { useCanTemplateToDashboard, useDashboardTemplates } from 'entities/dashboard-templates';
import { ActivatedCopiedType, MAX_COUNT_BUNCH_VIEWITEMS, NO_PARENT_ID, NO_SHEET_ID } from 'entities/dashboard-view';
import { getCopyViewItem, useDashboardViewServices } from 'features/dashboard-view';
import { useUser } from 'entities/user';
import { useUI } from 'entities/ui';
import { findAvailableBunchId } from 'shared/lib/structures/bunch';
import { v4 as uuidv4 } from 'uuid';
import { useCompany } from 'entities/company';
import { usePages } from 'shared/lib/hooks';
import { AddBtn } from 'shared/ui/configurators-components';
import { useTheme } from 'app/providers/theme';



interface Props {
  type: ActivatedCopiedType
}

/**
 * Кнопка добавления активного элемента шаблона в дашборд
 * либо целиком либо только 1
 */
export const AddToDashboardBtn: FC<Props> = memo(({ type }) => {
  const { userId } = useUser();
  const { paramsCompanyId } = useCompany();
  const { setWarningMessage } = useUI();
  const { selectedId, selectedTemplate, setOpened } = useDashboardTemplates();
  const { selectedItem, viewItems, serviceCreateGroupViewItems } = useDashboardViewServices();
  const { dashboardSheetId } = usePages();
  const { canAddFromTemplate } = useCanTemplateToDashboard();
  const theme = useTheme();
  const isAll = type === 'copyItemsAll';


  const handleClick = useCallback(() => {
    if (! selectedId || ! selectedTemplate) return setWarningMessage('Не выбран элемент для добавления');
    if (! canAddFromTemplate) return setWarningMessage('В выбранный в дашборде элемент нельзя добавлять элементы');

    // Copying
    const copiedViewItems = getCopyViewItem(
      { type, id: selectedId },
      selectedItem?.id || NO_PARENT_ID, // Если нажали из корня
      Object.values(selectedTemplate.viewItems),
      userId
    );

    // Adding bunchId to copied items
    const availableBunchId  = findAvailableBunchId(viewItems, MAX_COUNT_BUNCH_VIEWITEMS, copiedViewItems.length);
    const bunchId           = availableBunchId ? availableBunchId : uuidv4();
    const bunchAction       = availableBunchId ? 'update' : 'create';
    const copiedWithBunchId = copiedViewItems.map(item => {
      const newItem = { ...item, bunchId };

      if (! selectedItem?.id) { // Если шаблон добавляют в корень, то помещаем в dashboardSheetId
        newItem.sheetId = dashboardSheetId || NO_SHEET_ID;
      }
      return newItem;
    });

    serviceCreateGroupViewItems({
      companyId      : paramsCompanyId,
      bunchUpdatedMs : Date.now(),
      viewItems      : copiedWithBunchId,
      bunchAction,
    });

    setOpened(false);
  },
    [
      selectedItem, paramsCompanyId, viewItems, userId, selectedTemplate, selectedId, dashboardSheetId, type,
      canAddFromTemplate, setOpened, setWarningMessage, serviceCreateGroupViewItems
    ]
  );


  if (! selectedId) return null;

  return (
    <AddBtn
      title     = {isAll ? 'All' : '1'}
      toolTitle = {`Добавить этот элемент в дашборд (${isAll ? 'со всеми вложенными элементами' : 'без вложений'})`}
      color     = {isAll ? theme.palette.primary.main : ''}
      startIcon = {MoveIcon}
      onClick   = {handleClick}
    />
  )
});
