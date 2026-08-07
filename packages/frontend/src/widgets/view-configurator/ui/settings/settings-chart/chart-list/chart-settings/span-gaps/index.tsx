import { FC, memo } from 'react';
import { RowFlagByScheme } from '../../../../../base-features-components';



interface Props {
  index        : number // Index charts in settings.charts
}

/** Разрыв линии при отсутствии данных */
export const ChartSpanGaps: FC<Props> = memo(({ index }) => (
  <RowFlagByScheme
    scheme       = {`settings.charts.[${index}].datasets.spanGaps`}
    title        = 'SpanGaps'
    toolTitle    = 'Разрыв линии при отсутствии данных'
  />
));
