import { FC, memo, MouseEvent, useCallback } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { JustifyContentType, ViewItemStylesField } from 'entities/dashboard-view';
import { Tooltip } from 'shared/ui/tooltip';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';



interface Props {
  value    : JustifyContentType
  onChange : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** justify-content */
export const JustifyContent: FC<Props> = memo(({ value, onChange }) => {
  const handleChange = useCallback((e: MouseEvent<HTMLElement>, newAlignment: JustifyContentType) => {
    onChange('justifyContent', newAlignment, 'JustifyContent');
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
        <ToggleButton value='flex-start' aria-label='flex-start'>
          <AlignHorizontalLeftIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='По правому краю'>
        <ToggleButton value='flex-end' aria-label='flex-end'>
          <AlignHorizontalRightIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='По центру'>
        <ToggleButton value='center' aria-label='center'>
          <AlignHorizontalCenterIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='По базовой линии'>
        <ToggleButton value='baseline' aria-label='baseline'>
          <VerticalAlignTopIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='Распределить space-between'>
        <ToggleButton value='space-between' aria-label='space-between'>
          <FormatAlignCenterIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='Распределить space-around'>
        <ToggleButton value='space-around' aria-label='space-around'>
          <FormatAlignCenterIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='Распределить space-evenly'>
        <ToggleButton value='space-evenly' aria-label='space-evenly'>
          <FormatAlignCenterIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='Растянуть'>
        <ToggleButton value='stretch' aria-label='stretch'>
          <FormatAlignJustifyIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
});
