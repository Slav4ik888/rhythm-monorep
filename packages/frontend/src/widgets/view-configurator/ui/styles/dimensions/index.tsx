import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItemStylesField, ViewItem } from 'entities/dashboard-view';
import { ChangeStyleItemDimensions as ChangeStyle } from './change-style-dimensions';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

export const DimensionsBox: FC<Props> = memo(({ selectedItem, onChange }) => (
  <SubHeader title='Размеры'>
    <ChangeStyle
      bold
      field        = 'width'
      title        = 'width'
      toolTitle    = 'Ширина элемента'
      value        = {selectedItem?.styles?.width}
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
    <ChangeStyle
      field        = 'minWidth'
      title        = 'minWidth'
      toolTitle    = 'Мин ширина элемента'
      value        = {selectedItem?.styles?.minWidth}
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
    <ChangeStyle
      field        = 'maxWidth'
      title        = 'maxWidth'
      toolTitle    = 'Макс ширина элемента'
      value        = {selectedItem?.styles?.maxWidth}
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
    <ChangeStyle
      bold
      field        = 'height'
      title        = 'height'
      toolTitle    = 'Высота элемента'
      value        = {selectedItem?.styles?.height}
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
    <ChangeStyle
      field        = 'minHeight'
      title        = 'minHeight'
      toolTitle    = 'Мин высота элемента'
      value        = {selectedItem?.styles?.minHeight}
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
    <ChangeStyle
      field        = 'maxHeight'
      title        = 'maxHeight'
      toolTitle    = 'Макс высота элемента'
      value        = {selectedItem?.styles?.maxHeight}
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
  </SubHeader>
));
