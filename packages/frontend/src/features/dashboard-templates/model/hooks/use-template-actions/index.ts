import { useCallback } from 'react';
import { Template, useDashboardTemplates, MAX_COUNT_BUNCH_TEMPLATES } from 'entities/dashboard-templates';
import { ActivatedCopiedType, createNextOrder, NO_SHEET_ID, useDashboardViewState } from 'entities/dashboard-view';
import { getCopyViewItem } from 'features/dashboard-view';
import { v4 as uuidv4 } from 'uuid';
import { creatorFixDate, updateEntities } from 'entities/base';
import { useUser } from 'entities/user';
import { findAvailableBunchId } from 'shared/lib/structures/bunch';
import { modifyNestedProperty } from 'shared/helpers/objects';
import { chartOptionsToRemove } from './consts';



export const useTemplateActions = () => {
  const { userId } = useUser();
  const { templates, setOpened, serviceUpdateTemplate } = useDashboardTemplates();
  const { selectedItem, viewItems } = useDashboardViewState();


  const createTemplate = useCallback((type: ActivatedCopiedType) => {
    const templateId = uuidv4();

    const copiedViewItems = getCopyViewItem(
      { type, id: selectedItem.id },
      templateId,
      viewItems,
      userId
    );

    // TODO: Проверку кол-ва viewItems в bunch в template а не по templates как сейчас
    // Adding bunchId to copied items
    const availableBunchId  = findAvailableBunchId(templates, MAX_COUNT_BUNCH_TEMPLATES);
    const bunchId           = availableBunchId ? availableBunchId : uuidv4();
    const copiedWithBunchId = copiedViewItems.map(item => {
      const preparedItem = {
        ...item,
        bunchId: '', // Очищаем bunchId
      };

      // Если chart удаляем возможные ограничения
      if (item.type === 'chart') {
        modifyNestedProperty(preparedItem, chartOptionsToRemove);
      }

      return preparedItem
    });


    const template: Template = {
      id         : templateId,
      bunchId,
      type       : selectedItem.type,
      order      : createNextOrder(templates),
      viewItems  : updateEntities({}, copiedWithBunchId),
      createdAt  : creatorFixDate(userId),
      lastChange : creatorFixDate(userId)
    };

    serviceUpdateTemplate({
      bunchUpdatedMs : Date.now(),
      bunchAction    : availableBunchId ? 'update' : 'create',
      template
    });

    // Открываем Templates
    setOpened(true);
  },
    [userId, templates, selectedItem, viewItems, setOpened, serviceUpdateTemplate]
  );


  return {
    createTemplate
  }
};
