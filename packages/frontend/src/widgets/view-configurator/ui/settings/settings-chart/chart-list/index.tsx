import { FC, memo } from 'react';
import { SelectChartType } from './chart-settings/select-chart-type';
import { ChartLabel } from './chart-settings/chart-label';
import { ConfiguratorSubBoxWrapper, ConfiguratorTitle } from 'shared/ui/configurators-components';
import { ChartPointRadius } from './chart-settings/point-radius';
import { ChartPointBackgroundColor } from './chart-settings/point-background-color';
import { ChartBorderColor } from './chart-settings/border-сolor';
import { ChartBackgroundColor } from './chart-settings/background-сolor';
import { ChartBorderWidth } from './chart-settings/border-width';
import { ViewItem } from 'entities/dashboard-view';
import { ChartTrendCheckbox } from './chart-settings/trend/checkbox';
import { ChartTrendColor } from './chart-settings/trend/сolor';
import { ChartTrendWidth } from './chart-settings/trend/width';
import { AddNewChart, ControlChartBar } from 'features/dashboard-view';
import { ChartKods } from './chart-settings/chart-kods';
import { isLine, isNotPie } from 'entities/charts';
import { ChartSpanGaps } from './chart-settings/span-gaps';
import { ChartShiftValues } from './chart-settings/shift-values';
import { ChartHidden } from './chart-settings/hidden';
import { ChartBarPercentage } from './chart-settings/bar-percentage';
import { ChartCategoryPercentage } from './chart-settings/category-percentage';
import { InvertedData } from '../../base-components';
import { ViewItemChartTension } from '../tension';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Отрисовки списка графиков */
export const ViewItemChartSettingsList: FC<Props> = memo(({ selectedItem }) => (
  <>
    {
      selectedItem?.settings?.charts
      && selectedItem?.settings.charts.length > 0
      && selectedItem?.settings.charts.map((item, index) => (
        <ConfiguratorSubBoxWrapper title={`График ${index + 1}`} key={index}>
          <ConfiguratorTitle title='Общие настройки' type='subtitle1' />
          <SelectChartType index={index} selectedItem={selectedItem} />
          <ChartKods       index={index} selectedItem={selectedItem} />
          <InvertedData    index={index} type={selectedItem?.type} />
          <ChartLabel      index={index} selectedItem={selectedItem} />
          <ChartHidden     index={index} selectedItem={selectedItem} />
          {/* Выбрать период дат: общий или уникальный */}

          {
            isNotPie(selectedItem)
              ?                  <>
                  {
                    isLine(selectedItem) && <>
                      <ConfiguratorTitle title='Точки' type='subtitle1' />
                      <ChartPointRadius          index={index} selectedItem={selectedItem} />
                      <ChartPointBackgroundColor index={index} selectedItem={selectedItem} />
                    </>
                  }


                  <ConfiguratorTitle title='Линия графика' type='subtitle1' />
                  <ChartBorderWidth        index={index} selectedItem={selectedItem} />
                  <ChartBorderColor        index={index} selectedItem={selectedItem} />
                  <ChartBackgroundColor    index={index} selectedItem={selectedItem} />
                  {
                    isLine(selectedItem) && <>
                      <ViewItemChartTension index={index} />
                    </>
                  }
                  {
                    item?.chartType === 'bar' && <>
                      <ChartBarPercentage      index={index} selectedItem={selectedItem} />
                      <ChartCategoryPercentage index={index} selectedItem={selectedItem} />
                    </>
                  }

                  <ChartSpanGaps           index={index} />
                  <ChartShiftValues        index={index} selectedItem={selectedItem} />

                  <ConfiguratorTitle title='Линия тренда' type='subtitle1' />
                  <ChartTrendCheckbox index={index} />
                  <ChartTrendWidth    index={index} selectedItem={selectedItem} />
                  <ChartTrendColor    index={index} selectedItem={selectedItem} />
                </>
              : <>
                  <ChartBackgroundColor index={index} selectedItem={selectedItem} />
                </>
          }

          <ControlChartBar index={index} />
        </ConfiguratorSubBoxWrapper>
      ))
    }

    <AddNewChart />
  </>
));
