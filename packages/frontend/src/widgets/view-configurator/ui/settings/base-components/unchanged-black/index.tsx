import { FC, memo } from 'react';
import { RowFlagByScheme } from '../../../base-features-components';



/** При отсутствии изменений в результатах красить чёрным цветом */
export const UnchangedBlack: FC = memo(() => (
  <RowFlagByScheme
    scheme       = 'settings.unchangedBlack'
    title        = 'UnchangedBlack'
    toolTitle    = 'При отсутствии изменений в результатах красить чёрным цветом'
  />
));
