import { FC, memo } from 'react';
import { arrayFontWeights } from 'entities/dashboard-view';
import { RowSelectByScheme } from '../../../base-features-components';



interface Props {
  scheme       : string
}

/** Set fontWeight */
export const FontWeightRow: FC<Props> = memo(({ scheme }) => (
  <RowSelectByScheme
    scheme       = {scheme}
    title        = 'font-weight'
    toolTitle    = 'font-weight'
    array        = {arrayFontWeights}
  />
));
