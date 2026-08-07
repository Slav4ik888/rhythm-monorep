import { FC, memo, useEffect, useState, MouseEvent, useCallback } from 'react';
import Box from '@mui/material/Box';
import { ViewItem, ViewItemStylesField } from 'entities/dashboard-view';
import { f } from 'shared/styles';
import { SelectValue } from '../../../../../../shared/ui/configurators-components/select';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { getDimension, isPx } from './utils';
import { InputByScheme } from '../../../base-features-components';



interface Props {
  title        : string
  bold?        : boolean
  toolTitle    : string
  field        : ViewItemStylesField
  value        : number | string | undefined
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** Размеры */
export const ChangeStyleItemDimensions: FC<Props> = memo(({ selectedItem, field, bold, toolTitle, title,
  value = '', onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(''); // Если не строка или она пуста то это число
  const [isValueNumber, setIsValuerNumber] = useState(isPx(value));

  useEffect(() => {
    setSelectedValue(getDimension(value));
    setIsValuerNumber(isPx(value));
  }, [value]);


  const handleSelectedValue = useCallback((selected: string) => {
    setSelectedValue(selected);

    if (selected !== 'in px') return onChange(field, selected, 'ChangeStyleItemDimensions');
    if (selected === 'in px') return onChange(field, 0, 'ChangeStyleItemDimensions');

    setIsValuerNumber(true);
    return undefined
  }, [field, setSelectedValue, setIsValuerNumber, onChange]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle title={title} toolTitle={toolTitle} bold={bold} />

      <Box sx={{ ...f('-c') }}>
        {/* In px */}
        <InputByScheme
          type         = 'number'
          selectedItem = {selectedItem}
          scheme       = {`styles.${field}`}
          width        = '4rem'
          disabled     = {! isValueNumber}
          transform    = {(v) => ((isValueNumber && v) || '') as number} // чтобы выводились только числа
          onChange     = {(e: MouseEvent, v: string | number) => {}}
          onBlur       = {(e: MouseEvent, v: string | number) => onChange(field, v, 'ChangeStyleItemDimensions')}
          onSubmit     = {(e: MouseEvent, v: string | number) => onChange(field, v, 'ChangeStyleItemDimensions')}
        />

        {/* In text */}
        <SelectValue
          selectedValue = {selectedValue}
          array         = {['-', 'in px', '100%', 'auto', 'max-content', 'min-content']}
          onSelect      = {handleSelectedValue}
        />
      </Box>
    </RowWrapper>
  )
});
