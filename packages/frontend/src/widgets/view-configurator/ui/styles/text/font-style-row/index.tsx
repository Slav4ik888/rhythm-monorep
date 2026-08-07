import { FC, memo } from 'react';
import { ViewItem, ViewItemStylesField } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { SelectFontStyle } from './select-font-style';



interface Props {
  field        : ViewItemStylesField
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** Set fontStyle */
export const FontStyleRow: FC<Props> = memo(({ field, selectedItem, onChange }) => (
  <RowWrapper>
    <ConfiguratorTextTitle title={field} toolTitle='font-style' bold />
    <SelectFontStyle
      field        = {field}
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
  </RowWrapper>
));
