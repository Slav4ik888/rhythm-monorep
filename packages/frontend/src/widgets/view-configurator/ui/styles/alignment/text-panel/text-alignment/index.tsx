import { FC, memo, MouseEvent, useCallback } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { TextAlignType, ViewItemStylesField } from 'entities/dashboard-view';
import { Tooltip } from 'shared/ui/tooltip';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';



interface Props {
  value    : TextAlignType | undefined
  onChange : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** text-align */
export const TextAlignment: FC<Props> = memo(({ value, onChange }) => {
  const handleChange = useCallback((e: MouseEvent<HTMLElement>, newAlignment: TextAlignType) => {
    onChange('textAlign', newAlignment, 'TextAlignment');
  }, [onChange]);

  return (
    <ToggleButtonGroup
      exclusive
      value      = {value}
      size       = 'small'
      aria-label = 'align-items'
      onChange   = {handleChange}
    >
      <Tooltip title='По левому краю'>
        <ToggleButton value='left'>
          <FormatAlignLeftIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='По центру'>
        <ToggleButton value='center'>
          <FormatAlignCenterIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='По правому краю'>
        <ToggleButton value='right'>
          <FormatAlignRightIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
});
