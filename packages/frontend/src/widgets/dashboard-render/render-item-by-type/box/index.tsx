import { FC, memo } from 'react';
import { ViewItem, ViewItemId, ParentsViewItems } from 'entities/dashboard-view';
import { DashboardRender } from '../..';



interface Props {
  parents     : ParentsViewItems
  item        : ViewItem
  isTemplate? : boolean    // если рендерится шаблон
  onSelect    : (id: ViewItemId) => void
}

/** Item box */
export const ItemBox: FC<Props> = memo(({ parents, item, isTemplate, onSelect }) => (
  <DashboardRender
    parents    = {parents}
    parentId   = {item.id}
    isTemplate = {isTemplate}
    onSelect   = {onSelect}
  />
));
