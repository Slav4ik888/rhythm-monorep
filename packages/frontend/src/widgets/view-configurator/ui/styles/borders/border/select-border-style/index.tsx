import { FC, memo, useCallback } from 'react';
import { SelectValue } from 'shared/ui/configurators-components';
import { BorderStyleType, ViewItemStylesField, arrayBorderStyles, ViewItem } from 'entities/dashboard-view';



interface Props {
  field        : ViewItemStylesField
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

export const SelectBorderStyle: FC<Props> = memo(({ field, selectedItem, onChange }) => {
  const handleSelectedStyle = useCallback((selected: BorderStyleType) => onChange(field, selected, 'SelectBorderStyle'),
    [field, onChange]
  );


  return (
    <SelectValue
      selectedValue = {selectedItem?.styles?.[field] as string || 'none'}
      array         = {arrayBorderStyles}
      sx            = {{ root: { width: '80px', mr: 1 } }}
      // @ts-ignore
      onSelect      = {handleSelectedStyle}
    />
  )
});
