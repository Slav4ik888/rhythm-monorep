import { FC, memo, useMemo } from 'react';
import { getKod, useDashboardViewState, ViewItem } from 'entities/dashboard-view';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import {
  DashboardStatisticItem, useDashboardData, getEntitiesByPeriod, calculateStartDate, PeriodType,
  PayloadGetEntitiesByPeriod
} from 'entities/dashboard-data';
import { getData, getDataDoughnut, getOptions, getTemplateData, getTemplateDataDoughnut } from './lib';
import { isNotPie } from 'entities/charts';



interface Props {
  isTemplate? : boolean // если рендерится шаблон
  item        : ViewItem
}

/** Item chart */
export const ItemChartjs: FC<Props> = memo(({ item, isTemplate }) => {
  const { activeDates, activeEntities, startEntities, startDates, activeDateEnd } = useDashboardData();
  const { entities } = useDashboardViewState();

  const data = useMemo(() => {
    // For Templates
    if (isTemplate) {
      return isNotPie(item)
        ? getTemplateData(item)
        : getTemplateDataDoughnut(item)
    }
    // For Dashboard
    else {
      let individualData = {} as PayloadGetEntitiesByPeriod;
      const individualPeriod = entities[item.settings?.periodId || '']?.settings?.selectedPeriod;

      // Prepare for Individual
      if (individualPeriod) {
        const calcedStartDate = calculateStartDate(activeDateEnd, individualPeriod as PeriodType) as number;

        const individualEntites = getEntitiesByPeriod(
          startEntities,
          startDates,
          { start: calcedStartDate, end: activeDateEnd }
        );
        individualData = individualEntites;
      }

      // Get result
      const itemsData = item.settings?.charts?.map(chart => {
        const kod = getKod(entities, item, chart);

        return individualPeriod
          ? individualData.activeEntities[kod] as DashboardStatisticItem<number>
          : activeEntities[kod] as DashboardStatisticItem<number>
      }) || [];

      return isNotPie(item)
        ? getData(
            individualPeriod ? individualData.activeDates : activeDates,
            itemsData,
            item,
            entities
          )
        : getDataDoughnut(itemsData, item)
    }
  },
    [activeDates, activeEntities, startEntities, startDates, activeDateEnd, item, entities, isTemplate]
  );

  const type = item.settings?.charts?.[0]?.chartType || 'line';

  // console.log('data: ', data);
  // console.log('datasets: ', data.datasets);

  return (
    <Chart
      type    = {type}
      data    = {data}
      options = {getOptions(type, item.settings?.chartOptions || {})}
    />
  )
});
