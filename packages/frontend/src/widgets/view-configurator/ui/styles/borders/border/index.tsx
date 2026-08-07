import { FC, memo, useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { ViewItem, ViewItemStylesField } from 'entities/dashboard-view';
import { ColorPicker } from 'shared/lib/colors-picker';
import { SelectBorderStyle } from './select-border-style';
import { InputByScheme } from '../../../base-features-components';
import { EnableBorderCheckbox } from './enable-border-checkbox';



interface Props {
  fieldWidth   : ViewItemStylesField
  fieldStyle   : ViewItemStylesField
  fieldColor   : ViewItemStylesField
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** border: width style color */
export const BorderRow: FC<Props> = memo(({ fieldWidth, fieldStyle, fieldColor, selectedItem, onChange }) => {
  const [enabled, setEnabled] = useState(Boolean(selectedItem?.styles?.[fieldWidth]));

  useEffect(() => {
    setEnabled(Boolean(selectedItem?.styles?.[fieldWidth]));
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedItem]
  );

  const handleSubmitColor = useCallback((value: string) => onChange(fieldColor, value, 'BorderRow'),
    [fieldColor, onChange]
  );


  return (
    <RowWrapper>
      <ConfiguratorTextTitle title='border' toolTitle='border' bold />

      <EnableBorderCheckbox
        fieldWidth = {fieldWidth}
        enabled    = {enabled}
        setEnabled = {setEnabled}
        onChange   = {onChange}
      />

      {
        enabled && (
          <Box sx={{ ...f('-c-fe') }}>
            <InputByScheme
              type         = 'number'
              scheme       = {`styles.${fieldWidth}`}
              width        = '2.5rem'
              selectedItem = {selectedItem}
            />

            <SelectBorderStyle
              field        = {fieldStyle}
              selectedItem = {selectedItem}
              onChange     = {onChange}
            />

            <ColorPicker
              defaultColor = {selectedItem?.styles?.[fieldColor] as string || 'none'}
              onChange     = {handleSubmitColor}
            />
          </Box>
        )
      }
    </RowWrapper>
  )
});
