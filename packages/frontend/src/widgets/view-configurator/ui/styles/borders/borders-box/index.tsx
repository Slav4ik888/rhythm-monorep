import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItemStylesField, ViewItem } from 'entities/dashboard-view';
import { BorderRow } from '../border';
import { BorderRadiusRow } from '../border-radius';
import { BoxShadowRow } from '../box-shadow';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** Рамки */
export const BordersBox: FC<Props> = memo(({ selectedItem, onChange }) => (
  <SubHeader title='Рамка'>
    <BorderRow
      fieldWidth   = 'borderWidth'
      fieldStyle   = 'borderStyle'
      fieldColor   = 'borderColor'
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
    <BorderRadiusRow
      selectedItem = {selectedItem}
    />
    <BoxShadowRow
      field        = 'boxShadow'
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
  </SubHeader>
));
