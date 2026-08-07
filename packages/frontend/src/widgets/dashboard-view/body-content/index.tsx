import { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { DashboardRender } from '../../dashboard-render';
import {
  ViewItemId, NO_PARENT_ID, createNextOrder, getChildren, isClickInsideViewItem, ViewItem,
  MAX_COUNT_BUNCH_VIEWITEMS,
  NO_SHEET_ID
 } from 'entities/dashboard-view';
import { useAccess, useCompany } from 'entities/company';
import { getCopyViewItem, updateStyles } from 'features/dashboard-view';
import { useUser } from 'entities/user';
import { isEmpty, isNotEmpty, updateObject } from 'shared/helpers/objects';
import { PageLoader } from 'widgets/page-loader';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { v4 as uuidv4 } from 'uuid';
import { calcItemsInBunches, findAvailableBunchId } from 'shared/lib/structures/bunch';
import { useDashboardViewServices } from 'features/dashboard-view/model/hooks/use-dashboard-view-services';
import { PartialViewItemUpdate } from 'shared/api/features/dashboard-view';
import { usePages } from 'shared/lib/hooks';
import { DashboardBodyContentWrapper as Wrapper } from './wrapper';
import { NewCompanyMessage } from 'widgets/offers';
import { useDashboardData } from 'entities/dashboard-data';
import { HINTS_IDS, useHints } from 'entities/hints';
import { removeJivoSite } from 'shared/lib/remove-jivo';
import { useUI } from 'entities/ui';



export const DashboardBodyContent = memo(() => {
  const { userId, auth } = useUser();
  const { paramsCompanyId, paramsChangedCompany, serviceUpdateCompany } = useCompany();
  const {
    parentsViewItems, loading: loadingView, isLoaded, editMode, newSelectedId, isUnsaved, changedViewItem, selectedId,
    selectedItem, isMounted, activatedMovementId, viewItems, entities, activatedCopied, setNewSelectedId, setEditMode,
    setIsMounted, setDashboardViewItems, setSelectedId, serviceUpdateViewItems, serviceCreateGroupViewItems
  } = useDashboardViewServices();
  const { loading: loadingData } = useDashboardData();
  const [isRendering, setIsRendering] = useState(true);
  const { dashboardSheetId } = usePages();
  const { isDashboardAccessView, isDashboardAccessEdit } = useAccess();
  const { addHintsToQueue } = useHints();
  const { isMobile } = useUI();



  useEffect(() => {
    __devLog('DashboardBodyContent', calcItemsInBunches(viewItems));
  },
    [viewItems]
  );

  // Убираем надписи highcharts ввиду того, что они с РФ не работают, пидары
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
    const hc = document.querySelectorAll('.highcharts-credits');
    if (hc.length > 0) {
        __devLog('DashboardBodyContent', 'highcharts: ', hc);
        hc.forEach(item => item.remove());
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useLayoutEffect(() => {
    // Проверяем завершение рендера в RAF (после paint)
    const checkRenderComplete = () => {
      requestAnimationFrame(() => {
        setIsRendering(false);
        setIsMounted();
        if (auth) removeJivoSite(); // Если авторизован, убираем Живосайт
      });
    };

    checkRenderComplete();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

    // Если был включен editMode а в этой странице нет доступа к редактированию, тогда убрать editMode
  useEffect(() => {
    if (editMode && ! isDashboardAccessEdit) setEditMode({ editMode: false, companyId: paramsCompanyId })
  },
    [editMode, isDashboardAccessEdit, paramsCompanyId, setEditMode]
  );

  useEffect(() => {
    if (newSelectedId && ! loadingView && newSelectedId !== selectedId && ! isUnsaved) {
      setSelectedId(newSelectedId);
    }
  },
    [newSelectedId, loadingView, selectedId, isUnsaved, setSelectedId]
  );

  // Add Hints
  useEffect(() => {
    if (! isRendering && ! isMobile) addHintsToQueue(HINTS_IDS.dashboard)
  },
    [isRendering, isMobile, addHintsToQueue]
  );

  const handleSelectViewItem = useCallback((id: ViewItemId) => {
    if (! editMode) return
    // Обрабатывать нажатие на NO_PARENT_ID можно только для копирования или перемещения
    if (id === NO_PARENT_ID && ! activatedCopied && ! activatedMovementId) return

    // Если активирован выбранный элемент для ПЕРЕМЕЩЕНИЯ то его перемещаем в новый родительский элемент
    // НЕ меняя selectedId (чтобы не активировать NO_PARENT_ID)
    if (activatedMovementId) {
      if (selectedId === id) return // Нажали на этот же элемент
      if (activatedMovementId === selectedItem.parentId) return // Нажали на родительский элемент (по сути не оставляем в том же месте)
      if (
        entities[id]?.type !== 'box'                                   // Перемещать можно только в Box или
        && id !== NO_PARENT_ID                                         // в корневой элемент
        && entities[activatedMovementId]?.sheetId !== dashboardSheetId // и другой лист
      ) return

      // У activatedMovementId изменяем parentId на выбранный id
      const updatedViewItems = [];
      const movementItem: PartialViewItemUpdate = {
        id       : activatedMovementId,
        bunchId  : entities[activatedMovementId].bunchId,
        parentId : id,                                         // New parent`s id
        order    : createNextOrder(getChildren(viewItems, id)) // Next order in new parent
      };

      // Если перемещаем в корень, то указываем sheetId в которую перемещаем
      if (id === NO_PARENT_ID) {
        movementItem.sheetId = dashboardSheetId || NO_SHEET_ID;
      }

      updatedViewItems.push(movementItem);

      // Проверка, если нажали внутрь элемента (на его потомка)
      if (isClickInsideViewItem(entities, activatedMovementId, id)) {
        // Если нажали внутрь элемента, то меняем ему parentId
        const childItem: PartialViewItemUpdate = {
          id,
          bunchId  : entities[id].bunchId,
          parentId : entities[activatedMovementId].parentId,
          order    : entities[activatedMovementId].order // Меняем на тот что был у activatedMovementId
        };

        updatedViewItems.push(childItem);
      }

      // Чтобы обновился в уже обновлённом состоянии и не было isUnsaved
      const newStoredViewItem = {
        ...entities[activatedMovementId],
        ...movementItem
      };

      // updateViewItems(updatedViewItems); // Чтобы на экране изменение отобразилось максимально быстро, не дожидаясь обновления на сервере
      serviceUpdateViewItems({
        companyId      : paramsCompanyId,
        viewItems      : updatedViewItems,
        bunchUpdatedMs : Date.now(),
        newStoredViewItem
      });
    }


    else if (activatedCopied?.type === 'copyStyles') {
      if (selectedId === id) return // Нажали на этот же элемент

      const viewItems: PartialViewItemUpdate[] = [];
      const bunchUpdatedMs = Date.now();
      let newStoredViewItem = {} as ViewItem;

      if (isUnsaved) { /** Сохраняем текущий элемент, если он не сохранен */
        newStoredViewItem = updateObject(selectedItem, {
          id      : selectedId,
          bunchId : selectedItem.bunchId,
          ...changedViewItem
        });
        viewItems.push(newStoredViewItem);
      }

      // Обновляемый элемент со стилями для вставки
      viewItems.push({
        id,
        bunchId : entities[id].bunchId,
        styles  : updateStyles(entities[id], selectedItem)
      });

      serviceUpdateViewItems({
        companyId         : paramsCompanyId,
        newStoredViewItem : isUnsaved ? newStoredViewItem : undefined,
        viewItems,
        bunchUpdatedMs,
      });
    }


    // Если активирован выбранный элемент для КОПИРОВАНИЯ то его вставляем в выбранный элемент
    // НЕ меняя selectedId (чтобы не активировать NO_PARENT_ID)
    else if (activatedCopied?.type === 'copyItemsAll' || activatedCopied?.type === 'copyItemFirstOnly') {
      if (selectedId === id && activatedCopied?.type === 'copyItemsAll') return // Копировать всё в этот же элемент нельзя
      if (
        entities[id]?.type !== 'box'                                  // Копировать можно только в Box или
        && id !== NO_PARENT_ID                                        // в корневой элемент
        && entities[activatedCopied.id]?.sheetId !== dashboardSheetId // и другой лист
      ) return

      // Copying
      const copiedViewItems = getCopyViewItem(
        { type: activatedCopied.type, id: activatedCopied.id },
        id,
        viewItems,
        userId
      );

      // Adding bunchId to copied items
      const availableBunchId  = findAvailableBunchId(viewItems, MAX_COUNT_BUNCH_VIEWITEMS, copiedViewItems.length);
      const bunchId           = availableBunchId ? availableBunchId : uuidv4();
      const copiedWithBunchId = copiedViewItems.map(item => {
        const newItem = { ...item, bunchId };

        // Если перемещаем в корень, то указываем sheetId в которую перемещаем
        if (id === NO_PARENT_ID) {
          newItem.sheetId = dashboardSheetId || NO_SHEET_ID;
        }
        return newItem;
      });

      // Чтобы на экране изменение отобразилось максимально быстро, не дожидаясь обновления на сервере
      setDashboardViewItems({
        companyId      : paramsCompanyId,
        viewItems      : copiedWithBunchId,
        bunchesUpdated : {}, // Обновление произойдёт в serviceCreateGroupViewItems
      });

      serviceCreateGroupViewItems({
        companyId      : paramsCompanyId,
        viewItems      : copiedWithBunchId,
        bunchUpdatedMs : Date.now(),
        bunchAction    : availableBunchId ? 'update' : 'create',
      });
    }
    else if (isUnsaved) {
      if (selectedId === id) return // Click на самого себя не сохранять, тк это может быть ошибочный клик

      /** Сохраняем изменившиеся поля | стили */
      if (isEmpty(changedViewItem)) return

      const viewItem = {
        id      : selectedId,
        bunchId : selectedItem.bunchId,
        ...changedViewItem
      };

      serviceUpdateViewItems({
        companyId         : paramsCompanyId,
        viewItems         : [viewItem],
        newStoredViewItem : updateObject(selectedItem, viewItem),
        bunchUpdatedMs    : Date.now(),
      });
      setNewSelectedId(id); // Здесь сохраняется в newSelectedId а активация выбранного id происходит в useEffect
    }
    else {
      setNewSelectedId(id); // Здесь сохраняется в newSelectedId а активация выбранного id происходит в useEffect
    }


    /** Сохраняем изменившиеся customSettings */
    if (isUnsaved && selectedId !== id && isNotEmpty(paramsChangedCompany)) {
      serviceUpdateCompany({ id: paramsCompanyId, ...paramsChangedCompany });
    }
  },
    [
      editMode, selectedId, activatedMovementId, activatedCopied, viewItems, entities, userId, isUnsaved,
      dashboardSheetId, paramsChangedCompany, changedViewItem, paramsCompanyId, selectedItem, serviceUpdateCompany,
      serviceUpdateViewItems, setNewSelectedId, setDashboardViewItems, serviceCreateGroupViewItems
    ]
  );


  // Если нет дашборда, но есть доступ значит это новая компания
  if (! isRendering
    && ! loadingData
    && ! loadingView
    && isMounted
    && isDashboardAccessView
    && isLoaded              // Загружены ViewItems
    && ! viewItems.length) {
    // Попытка отловить ошибку - не залогиненный зашёл в демо2, всё загрузилось, затем я тыкнул "5лет Всё"
    // и всё исчезло и сработал этот механизм. Почему не ясно - помогла очистка кэша
    console.log('Попытка отловить ошибку - переключение на страницу с предложением из Демо страницы');
    console.log('isRendering: ', isRendering);
    console.log('loadingData: ', loadingData);
    console.log('loadingView: ', loadingView);
    console.log('isMounted: ', isMounted);
    console.log('isDashboardAccessView: ', isDashboardAccessView);
    console.log('isLoaded: ', isLoaded);
    console.log('viewItems.length: ', viewItems.length);

    return <NewCompanyMessage />
  }

  return (
    <Wrapper onClick = {() => handleSelectViewItem(NO_PARENT_ID)}>
      {
        isRendering
          ? <PageLoader loading={isRendering} text='Отрисовка графиков...' />
          : <DashboardRender
              parents  = {parentsViewItems}
              sheetId  = {dashboardSheetId || NO_SHEET_ID}
              parentId = 'no_parentId'
              onSelect = {handleSelectViewItem}
            />
      }
    </Wrapper>
  )
});
