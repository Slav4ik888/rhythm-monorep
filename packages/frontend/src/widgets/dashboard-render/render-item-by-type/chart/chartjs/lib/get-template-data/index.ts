import { ChartConfig, ChartConfigDatasets, fixPointRadius } from 'entities/charts';
import { checkInvertData, DashboardStatisticItem } from 'entities/dashboard-data';
import { TEMPLATES_MOCK_DATA } from 'entities/dashboard-templates';
import { ViewItem } from 'entities/dashboard-view';
import { formatDate, SUB } from 'shared/helpers/dates';
import { setValue } from 'shared/helpers/objects';
import { isArr, isStr } from 'shared/lib/validators';
import { calcTrend2 } from '../calc-trend-2';
import { prepareDatesForGreatestPeriod, prepareDataForChart } from '../get-data/utils';



/**
 * For Templates
 * Наполняет datasets всеми вложенными в item графиками
 */
export const getTemplateData = (viewItem: ViewItem): ChartConfig => {
  const allActiveDates = TEMPLATES_MOCK_DATA.activeDates;
  const itemsData = [TEMPLATES_MOCK_DATA.activeEntities['1-0-1'] as DashboardStatisticItem<number>];

  const { dates, greatestPeriodType } = prepareDatesForGreatestPeriod(allActiveDates, itemsData);
  const formattedDates = dates?.map(date => formatDate(date, 'DD mon YY', SUB.RU_ABBR_DEC));

  const config = {
    labels   : formattedDates, // any[] // Dates (метки на оси X)
    datasets : [      // ChartConfigDatasets[]
      ...itemsData.map((itemData, idx) => {
        const datasets            = viewItem?.settings?.charts?.[idx].datasets || {} as ChartConfigDatasets;
        const preparedData        = prepareDataForChart(itemData, datasets, allActiveDates, greatestPeriodType);
        const inverted            = false; // getChartInverted(viewItem, idx, entities);
        const checkedInvertedData = checkInvertData(inverted, preparedData);

        const result: ChartConfigDatasets = {
          type                 : setValue(viewItem?.settings?.charts?.[idx].chartType, 'line'),
          label                : setValue(datasets.label, `График ${idx + 1}`),
          data                 : checkedInvertedData.map(item => isStr(item) ? NaN : item), // Empty value changes for NaN
          tension              : 0,
          pointRadius          : setValue(datasets.pointRadius, fixPointRadius(dates)), // Толщика точки (круглешков)
          pointBorderColor     : 'transparent',
          pointBackgroundColor : setValue(datasets.pointBackgroundColor, 'rgb(1, 1, 1)'),
          borderColor          : setValue(datasets.borderColor, 'rgb(1, 1, 1)'),
          borderWidth          : setValue(datasets.borderWidth, 3), // Толщика линии
          backgroundColor      : setValue(datasets.backgroundColor, 'transparent'),
          fill                 : setValue(datasets.fill, true),
          // maxBarThickness      : 6,
          barPercentage        : setValue(datasets.barPercentage, 0.8),
          categoryPercentage   : setValue(datasets.categoryPercentage, 0.8),
          order                : setValue(datasets.order, idx + 1),
          spanGaps             : setValue(datasets.spanGaps, false),
          shiftValues          : setValue(datasets.shiftValues, 0),
          hidden               : setValue(datasets.hidden, false),
        };

        return result
    })],
  };


  viewItem?.settings?.charts?.forEach((itemChart, idx) => {
    // Если активирована линия тренда, рассчитываем данные тренда и добавляем как график
    if (itemChart.isTrend) {
      const trendData = calcTrend2(formattedDates, config.datasets?.[idx]?.data);

      // Цвет родителя в виде строки (если там массив) | шаблон
      const baseBColor = 'rgb(19, 40, 162)';
      const pbColor = config.datasets?.[idx]?.borderColor;
      const parentBorderColor: string = (isArr(pbColor) ? pbColor?.[0] : (pbColor as string)) || baseBColor;

      config.datasets.push({
        label           : 'Тренд',
        type            : 'line',
        data            : trendData,
        pointRadius     : 0,
        borderColor     : setValue(itemChart?.trendDataSets?.borderColor, parentBorderColor),
        borderWidth     : setValue(itemChart?.trendDataSets?.borderWidth, 3),
        order           : idx, // поверх (на 1<) графика parentChartsIdx
        parentChartsIdx : idx // чтобы знать чей это тренд
      });
    }
  });

  return config
}
