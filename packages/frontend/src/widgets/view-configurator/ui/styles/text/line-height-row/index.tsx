import { FC, memo, MouseEvent } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { RowInputByScheme } from '../../../base-features-components';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Set line-height */
export const LineHeightRow: FC<Props> = memo(({ selectedItem }) => (
  <RowInputByScheme
    scheme       = 'styles.lineHeight'
    type         = 'number'
    title        = 'line-height'
    toolTitle    = 'line-height'
    width        = '5rem'
    selectedItem = {selectedItem}
    onChange     = {(e: MouseEvent, v: string | number) => {}}
  />
));
