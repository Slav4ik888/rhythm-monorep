import { FC, memo } from 'react';
import { RowFlagByScheme } from '../../../base-features-components';



/** При отсутствии изменений чёрный треугольник повернуть влево */
export const IsLeft: FC = memo(() => (
  <RowFlagByScheme
    scheme       = 'settings.isLeft'
    title        = 'IsLeft'
    toolTitle    = 'При отсутствии изменений чёрный треугольник повернуть влево'
  />
));
