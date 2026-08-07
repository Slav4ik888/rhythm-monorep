import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { ViewItemStylesField, RgbaString, ViewItem } from 'entities/dashboard-view';
import { ColorPicker } from 'shared/lib/colors-picker';
import Checkbox from '@mui/material/Checkbox';
import { Tooltip } from 'shared/ui/tooltip';
import { splitGradinetRgba } from './utils';
import { SetLinearGradient } from './set-linear-gradient';
import { pxToRem } from 'shared/styles';



const sxPopover = {
  popover: {
    bottom: pxToRem(-260)
  },
};


interface Props {
  field        : ViewItemStylesField
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** background */
export const SetBackground: FC<Props> = memo(({ field, selectedItem, onChange }) => {
  const gradients = useMemo(() => splitGradinetRgba(selectedItem?.styles?.[field] as string),
    [field, selectedItem]
  );

  const [checked, setChecked] = useState(gradients.length === 3);
  const handleToggle = useCallback(() => setChecked(! checked), [checked, setChecked]);

  useEffect(() => {
    setChecked(gradients.length === 3);
  },
    [gradients.length, setChecked]
  );

  const handleBackground = useCallback((value: string) => onChange(field, value as unknown as string, 'SetBackground'),
    [field, onChange]
  );


  return (
    <RowWrapper>
      <ConfiguratorTextTitle
        bold
        title     = {field}
        toolTitle = 'background'
      />
      <Tooltip title = 'Настроить gradient'>
        <Checkbox
          size       = 'small'
          checked    = {checked}
          inputProps = {{ 'aria-label': field }}
          onChange   = {handleToggle}
        />
      </Tooltip>
      {
        checked
          ? <SetLinearGradient
              field        = {field}
              defaultValue = {selectedItem?.styles?.[field] as RgbaString}
              gradients    = {gradients}
              selectedItem = {selectedItem}
              sx           = {sxPopover}
              onChange     = {onChange}
            />
          : <ColorPicker
              defaultColor = {selectedItem?.styles?.[field] as RgbaString}
              sx           = {sxPopover}
              onChange     = {handleBackground}
            />
      }
    </RowWrapper>
  )
});
