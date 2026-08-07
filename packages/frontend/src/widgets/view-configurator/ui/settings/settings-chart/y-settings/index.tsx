import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItemChartScaleTicks as Ticks } from '../ticks';
import { ViewItemChartScaleGrid as Grid } from '../grid';
import { ViewItemChartScaleYMinMax as MinMax } from './min-max';
import { ViewItemChartScaleBorders as Borders } from '../borders';
import { ViewItem } from 'entities/dashboard-view';



interface Props {
  selectedItem: ViewItem | undefined
}

/** НАСТРОЙКИ ОСИ Y */
export const ViewItemChartScaleYSettings: FC<Props> = memo(({ selectedItem }) => (
  <SubHeader title='Ось Y'>
    <MinMax selectedItem={selectedItem} />
    <Grid
      scale        = 'y'
      selectedItem = {selectedItem}
    />
    <Ticks
      scale        = 'y'
      selectedItem = {selectedItem}
    />
    <Borders
      scale        = 'y'
      selectedItem = {selectedItem}
    />
  </SubHeader>
));
