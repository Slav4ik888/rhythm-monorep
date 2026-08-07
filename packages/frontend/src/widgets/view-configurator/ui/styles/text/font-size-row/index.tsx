import { FC, memo, MouseEvent } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { RowInputByScheme } from '../../../base-features-components';



interface Props {
  scheme       : string
  selectedItem : ViewItem | undefined
}

/** Set fontSize */
export const FontSizeRow: FC<Props> = memo(({ selectedItem, scheme }) => (
  <RowInputByScheme
    scheme       = {scheme}
    type         = 'number'
    title        = 'font-size'
    toolTitle    = 'font-size'
    width        = '5rem'
    selectedItem = {selectedItem}
    onChange     = {(e: MouseEvent, v: string | number) => {}}
  />
));
