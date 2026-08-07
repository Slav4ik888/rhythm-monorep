import { FC, memo, useCallback } from 'react';
import { SelectValue } from 'shared/ui/configurators-components';
import { FontStyleType, ViewItemStylesField, arrayFontStyles, ViewItem } from 'entities/dashboard-view';



interface Props {
  field        : ViewItemStylesField
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

export const SelectFontStyle: FC<Props> = memo(({ field, selectedItem, onChange }) => {
  const handleSelectedStyle = useCallback((selected: FontStyleType) => {
    onChange(field, selected, 'SelectFontStyle');
  },
    [field, onChange]
  );

  return (
    <SelectValue
      selectedValue = {selectedItem?.styles?.[field] as string || 'default'}
      array         = {arrayFontStyles}
      sx            = {{ root: { width: '100px' } }}
      // @ts-ignore
      onSelect      = {handleSelectedStyle}
    />
  )
});
