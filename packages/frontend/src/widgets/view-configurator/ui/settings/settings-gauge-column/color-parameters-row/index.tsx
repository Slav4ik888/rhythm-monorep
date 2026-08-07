import { FC, memo } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { RowColorByScheme } from '../../../base-features-components';



interface Props {
  selectedItem: ViewItem | undefined
}

export const ColorParametersRow: FC<Props> = memo(({ selectedItem }) => (
  <RowColorByScheme
    selectedItem = {selectedItem}
    scheme       = 'settings.parametersLabelColor'
    title        = 'Parameters label color'
    toolTitle    = 'Цвет меток параметров'
  />
));
