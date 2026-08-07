import { FC, memo } from 'react';
import { ConfiguratorTitle } from 'shared/ui/configurators-components';
import { ChartSetColorByScheme } from '../set-сolor';
import { RowFlagByScheme, RowInputByScheme, RowSelectByScheme } from '../../../base-features-components';
import { ViewItem } from 'entities/dashboard-view';
import { arrScaleYPosition } from 'entities/charts';



interface Props {
  scale        : 'x' | 'y'
  selectedItem : ViewItem | undefined
}

/** Настройки на осях - Ticks */
export const ViewItemChartScaleTicks: FC<Props> = memo(({ scale, selectedItem }) => (
  <>
    <ConfiguratorTitle title='Ticks' type='title2' />
    <RowFlagByScheme
      scheme       = {`settings.chartOptions.scales.${scale}.ticks.display`}
      title        = 'display'
      toolTitle    = 'Показать/скрыть'
    />
    {
      scale === 'y' && (
        <RowSelectByScheme
          scheme       = 'settings.chartOptions.scales.y.position'
          title        = 'position'
          toolTitle    = 'С какой стороны отображать ось Y'
          array        = {arrScaleYPosition}
        />
      )
    }
    <ChartSetColorByScheme
      scheme       = {`settings.chartOptions.scales.${scale}.ticks.color`}
      title        = 'color'
      toolTitle    = 'Настроить цвет'
      selectedItem = {selectedItem}
    />
    {
      scale === 'x' && <>
        <RowInputByScheme
          scheme       = 'settings.chartOptions.scales.x.ticks.maxTicksLimit'
          type         = 'number'
          title        = 'maxTicksLimit'
          toolTitle    = 'Максимальное кол-во подписей на оси X'
          selectedItem = {selectedItem}
          onChange     = {() => {}}
        />
        <RowInputByScheme
          scheme       = 'settings.chartOptions.scales.x.ticks.minRotation'
          type         = 'number'
          title        = 'minRotation'
          toolTitle    = 'Максимальный угол поворота подписи. 0 - текст строго горизонтальный'
          selectedItem = {selectedItem}
          onChange     = {() => {}}
        />
        <RowInputByScheme
          scheme       = 'settings.chartOptions.scales.x.ticks.maxRotation'
          type         = 'number'
          title        = 'maxRotation'
          toolTitle    = 'Максимальный угол поворота'
          selectedItem = {selectedItem}
          onChange     = {() => {}}
        />
      </>
    }
  </>
));
