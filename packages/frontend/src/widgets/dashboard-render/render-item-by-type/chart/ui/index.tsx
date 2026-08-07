import { FC, memo } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { ItemChartjs } from '../chartjs';
import { ItemHighchart } from '../highchart';



interface Props {
  isTemplate? : boolean // если рендерится шаблон
  item        : ViewItem
}

/** Item chart */
export const ItemChart: FC<Props> = memo(({ item, isTemplate }) => {
  const type = item.settings?.charts?.[0]?.chartType || 'line';

  if (type === 'pie' || type === 'doughnut') return (
    <ItemHighchart
      item       = {item}
      isTemplate = {isTemplate}
    />
  )
  else return (
    <ItemChartjs
      item       = {item}
      isTemplate = {isTemplate}
    />
  )
});
