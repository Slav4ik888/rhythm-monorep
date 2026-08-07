import { FC, memo, useMemo, useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getKod, useDashboardViewState, ViewItem } from 'entities/dashboard-view';
import { DashboardStatisticItem, useDashboardData } from 'entities/dashboard-data';
import { getOptions } from './lib';
import { getTemplateOptions } from './lib/get-template-options';



interface Props {
  isTemplate? : boolean // если рендерится шаблон
  item        : ViewItem
}

/** Item chart */
export const ItemHighchart: FC<Props> = memo(({ item, isTemplate }) => {
  const { activeEntities } = useDashboardData();
  const { entities } = useDashboardViewState();

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);


  const itemData = useMemo(() => item.settings?.charts?.map(chart => {
    const kod = getKod(entities, item, chart);

    return activeEntities[kod] as DashboardStatisticItem<number>
  }) || [],
    [activeEntities, item, entities]
  );


  return (
    <HighchartsReact
      highcharts = {Highcharts}
      options    = {isTemplate ? getTemplateOptions(item) : getOptions(itemData, item)}
      ref        = {chartComponentRef}
      // {...props}
    />
  )
});
