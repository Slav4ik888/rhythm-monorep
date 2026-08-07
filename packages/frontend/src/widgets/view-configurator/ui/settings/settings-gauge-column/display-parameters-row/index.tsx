import { FC, memo } from 'react';
import { RowFlagByScheme } from '../../../base-features-components';



export const DisplayParametersRow: FC = memo(() => (
  <RowFlagByScheme
    scheme       = 'settings.displayParameters'
    title        = 'Display parameters'
    toolTitle    = 'Показтать метки с выбранными параметрами'
  />
));
