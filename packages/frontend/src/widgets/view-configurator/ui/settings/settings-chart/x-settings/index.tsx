import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItemChartScaleTicks as Ticks } from '../ticks';
import { ViewItemChartScaleGrid as Grid } from '../grid';
import { ViewItemChartScaleBorders as Borders } from '../borders';
import { ViewItem } from 'entities/dashboard-view';



interface Props {
  selectedItem: ViewItem | undefined
}

/** НАСТРОЙКИ ОСИ X */
export const ViewItemChartScaleXSettings: FC<Props> = memo(({ selectedItem }) => (
  <SubHeader title='Ось X'>
    <Grid
      scale        = 'x'
      selectedItem = {selectedItem}
    />
    <Ticks
      scale        = 'x'
      selectedItem = {selectedItem}
    />
    <Borders
      scale        = 'x'
      selectedItem = {selectedItem}
    />
  </SubHeader>
));
