import { FC, memo, useCallback } from 'react';
import { SelectValue } from 'shared/ui/configurators-components';
import { TextWrapType, ViewItemStylesField, arrayTextWrap, ViewItem } from 'entities/dashboard-view';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

export const SelectTextWrap: FC<Props> = memo(({ selectedItem, onChange }) => {
  const handleSelectedStyle = useCallback((selected: TextWrapType) => {
    onChange('textWrap', selected, 'SelectTextWrap');
  },
    [onChange]
  );


  return (
    <SelectValue
      selectedValue = {selectedItem?.styles?.textWrap || 'inherit'}
      array         = {arrayTextWrap}
      sx            = {{ root: { width: '100px' } }}
      // @ts-ignore
      onSelect      = {handleSelectedStyle}
    />
  )
});
