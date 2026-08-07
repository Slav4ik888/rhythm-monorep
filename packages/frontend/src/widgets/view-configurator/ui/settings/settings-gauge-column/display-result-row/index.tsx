import { FC, memo } from 'react';
import { RowFlagByScheme } from '../../../base-features-components';



export const DisplayResultRow: FC = memo(() => (
  <RowFlagByScheme
    scheme       = 'settings.displayResult'
    title        = 'Display result'
    toolTitle    = 'Показтать метки с выбранными параметрами'
  />
));
