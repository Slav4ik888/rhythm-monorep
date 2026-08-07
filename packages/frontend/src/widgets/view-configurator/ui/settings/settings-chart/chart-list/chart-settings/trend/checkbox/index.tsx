import { FC, memo } from 'react';
import { RowFlagByScheme } from '../../../../../../base-features-components';



interface Props {
  index        : number // Index charts in settings.charts
}

/** Отображение линии тренда */
export const ChartTrendCheckbox: FC<Props> = memo(({ index }) => (
  <RowFlagByScheme
    scheme       = {`settings.charts.[${index}].isTrend`}
    title        = 'Is trend'
    toolTitle    = 'Отображение линии тренда'
  />
));
