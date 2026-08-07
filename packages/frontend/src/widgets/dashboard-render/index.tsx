import { FC, memo, useMemo } from 'react';
import { RenderViewItemByType } from './render-item-by-type';
import { ViewItemId, ParentsViewItems } from 'entities/dashboard-view';
import { sortingArr } from 'shared/helpers/sorting';
import { ItemWrapper } from './wrapper-item';



interface Props {
  parents     : ParentsViewItems
  parentId    : ViewItemId // Current Rendered ParentId
  sheetId?    : string     // Current SheetId только для корневых компонентов
  isTemplate? : boolean    // если рендерится шаблон
  onSelect    : (id: ViewItemId) => void
}

/**
 * Подготавливаем корневые компоненты и рендерим всех children
 */
export const DashboardRender: FC<Props> = memo(({ parents, parentId, sheetId, isTemplate, onSelect }) => {
  const sorted = useMemo(() => {
    // Если это корневые элементы, отбираем только те что соответствуют текущей sheetId
    if (sheetId) {
      const parentsBySheetId = parents[parentId]?.filter(item => item.sheetId === sheetId);
      return sortingArr(parentsBySheetId, 'order')
    }
    else {
      return sortingArr(parents[parentId], 'order')
    }
  },
    [parents, parentId, sheetId]
  );

  if (! parents[parentId]) return null;

  return (
    <>
      {
        sorted.map(item => (
          <ItemWrapper key={item.id} item={item} onSelect={onSelect}>
            <RenderViewItemByType
              parents    = {parents}
              item       = {item}
              isTemplate = {isTemplate}
              onSelect   = {onSelect}
            />
          </ItemWrapper>
        ))
      }
    </>
  )
});
