import { FC, memo } from 'react';
import { ConfiguratorTitle } from 'shared/ui/configurators-components';
import { ChartSetColorByScheme } from '../set-сolor';
import { RowFlagByScheme } from '../../../base-features-components/rows/row-flag-by-scheme';
import { ViewItem } from 'entities/dashboard-view';



interface Props {
  scale        : 'x' | 'y'
  selectedItem : ViewItem | undefined
}

/** Настройки на осях - Borders */
export const ViewItemChartScaleBorders: FC<Props> = memo(({ scale, selectedItem }) => (
  <>
    <ConfiguratorTitle title='Borders' type='title2' />
    <RowFlagByScheme
      scheme       = {`settings.chartOptions.scales.${scale}.border.display`}
      title        = 'display'
      toolTitle    = 'Показать/скрыть'
    />
    <ChartSetColorByScheme
      scheme       = {`settings.chartOptions.scales.${scale}.border.color`}
      title        = 'color'
      toolTitle    = 'Настроить цвет'
      selectedItem = {selectedItem}
    />
  </>
));
