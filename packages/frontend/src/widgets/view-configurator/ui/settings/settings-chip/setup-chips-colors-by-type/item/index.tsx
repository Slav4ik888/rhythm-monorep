import { FC, memo, useCallback } from 'react';
import { RowWrapper } from 'shared/ui/configurators-components';
import { BaseChipType, ChipContainer } from 'entities/dashboard-view';
import { ColorPicker } from 'shared/lib/colors-picker';
import { ColorSettingsType, CustomSettings } from 'entities/company';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { SetColorsItemInputField } from './input-field';



interface Props {
  type     : BaseChipType
  label    : string
  settings : CustomSettings
  onSubmit : (data: Partial<CustomSettings>) => void
}

/**  */
export const SetColorsItem: FC<Props> = memo(({ type, label, settings, onSubmit }) => {
  const color = settings?.[type]?.[label]?.color || '';
  const background = settings?.[type]?.[label]?.background || '';

  const handleChangeColor = useCallback((colorType: ColorSettingsType, value: string) => {
    onSubmit({
      [type]: {
        [label]: {
          [colorType]: value
        }
    } });
  }, [type, label, onSubmit]);


  return (
    <RowWrapper>
      <ChipContainer
        label     = {label}
        // toolTitle = {label}
        sx        = {{ color, background }}
      />

      {
        type === 'periodType' && (
          <SetColorsItemInputField
            value    = {settings?.[type]?.[label]?.title || ''}
            type     = {type}
            label    = {label}
            onSubmit = {onSubmit}
          />
        )
      }

      <Box sx={f()}>
        <ColorPicker
          defaultColor = {color}
          sx           = {{ root: { mr: 1 } }}
          onChange     = {(value: string) => handleChangeColor('color', value)}
        />
        <ColorPicker
          defaultColor = {background}
          onChange     = {(value: string) => handleChangeColor('background', value)}
        />
      </Box>
    </RowWrapper>
  )
});
