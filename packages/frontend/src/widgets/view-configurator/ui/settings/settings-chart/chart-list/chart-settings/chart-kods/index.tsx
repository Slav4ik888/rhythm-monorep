import { FC, memo } from 'react';
import { ChartSelectKod } from './select-kod';
import { ChartKodLabel } from './kod-label';
import { ViewItem } from 'entities/dashboard-view';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Выбор кода */
export const ChartKods: FC<Props> = memo(({ index, selectedItem }) => (
    <>
      <ChartSelectKod index={index} selectedItem={selectedItem} />
      <ChartKodLabel  index={index} selectedItem={selectedItem} />
    </>
  ));
