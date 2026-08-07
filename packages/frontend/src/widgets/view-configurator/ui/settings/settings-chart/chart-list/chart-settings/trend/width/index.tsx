import { FC, memo, MouseEvent } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { RowInputByScheme } from '../../../../../../base-features-components';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Толщина линии тренда */
export const ChartTrendWidth: FC<Props> = memo(({ index, selectedItem }) => (
  <RowInputByScheme
    type         = 'number'
    selectedItem = {selectedItem}
    scheme       = {`settings.charts.[${index}].trendDataSets.borderWidth`}
    title        = 'Trend width'
    toolTitle    = 'Выберите толщину линии тренда'
    width        = '7rem'
    clear        = {null}
    onChange     = {(e: MouseEvent, v: string | number) => {}}
  />
));
