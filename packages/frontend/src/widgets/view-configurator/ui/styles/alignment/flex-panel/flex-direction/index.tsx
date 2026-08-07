import { FC, memo, MouseEvent, useCallback } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { FlexDirectionType, ViewItemStylesField } from 'entities/dashboard-view';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { Tooltip } from 'shared/ui/tooltip';



interface Props {
  value    : FlexDirectionType
  onChange : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** flex-direction */
export const FlexDirection: FC<Props> = memo(({ value = 'row', onChange }) => {
  const handleChange = useCallback((e: MouseEvent<HTMLElement>, newAlignment: FlexDirectionType) => {
    onChange('flexDirection', newAlignment, 'FlexDirection');
  }, [onChange]);


  return (
    <ToggleButtonGroup
      exclusive
      value      = {value}
      size       = 'small'
      aria-label = 'flex-direction'
      onChange   = {handleChange}
    >
      <Tooltip title='В столбик'>
        <ToggleButton value='column' aria-label='column'>
          <TableRowsIcon />
        </ToggleButton>
      </Tooltip>

      <Tooltip title='В строку'>
        <ToggleButton value='row' aria-label='row'>
          <ViewColumnIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
});
