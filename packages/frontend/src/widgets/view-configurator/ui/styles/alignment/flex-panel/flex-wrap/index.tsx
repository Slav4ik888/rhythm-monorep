import { FC, memo, MouseEvent, useCallback } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { FlexWrapType, ViewItemStylesField } from 'entities/dashboard-view';
import { Tooltip } from 'shared/ui/tooltip';



interface Props {
  value    : FlexWrapType
  onChange : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** flex-wrap */
export const FlexWrap: FC<Props> = memo(({ value, onChange }) => {
  const handleChange = useCallback((e: MouseEvent<HTMLElement>, newAlignment: FlexWrapType) => {
    onChange('flexWrap', newAlignment, 'FlexWrap');
  }, [onChange]);


  return (
    <ToggleButtonGroup
      exclusive
      value      = {value}
      size       = 'small'
      aria-label = 'flex-wrap'
      onChange   = {handleChange}
    >
      <Tooltip title='flexWrap: nowrap'>
        <ToggleButton value='nowrap'>
          nowrap
        </ToggleButton>
      </Tooltip>
      <Tooltip title='flexWrap: wrap'>
        <ToggleButton value='wrap'>
          wrap
        </ToggleButton>
      </Tooltip>
      <Tooltip title='flexWrap: wrap-reverse'>
        <ToggleButton value='wrap-reverse'>
          wrap-reverse
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
});
