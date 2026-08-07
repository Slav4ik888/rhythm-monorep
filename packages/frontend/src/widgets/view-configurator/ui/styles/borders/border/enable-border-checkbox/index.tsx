import { FC, memo, useCallback } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { ViewItemStylesField } from 'entities/dashboard-view';
import { Tooltip } from 'shared/ui/tooltip';



interface Props {
  fieldWidth   : ViewItemStylesField
  enabled      : boolean
  setEnabled   : (flag: boolean) => void
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

export const EnableBorderCheckbox: FC<Props> = memo(({ fieldWidth, enabled, setEnabled, onChange }) => {
  const handleToggle = useCallback(() => {
    if (enabled) {
      onChange(fieldWidth, 0, 'EnableBorderCheckbox');
      setEnabled(false);
    }
    else {
      onChange(fieldWidth, 1, 'EnableBorderCheckbox');
      setEnabled(true);
    }
  },
    [fieldWidth, enabled, setEnabled, onChange]
  );


  return (
    <Tooltip title={`${enabled ? 'Отключить' : 'Включить'} рамку`}>
      <Checkbox
        size       = 'small'
        checked    = {enabled}
        inputProps = {{ 'aria-label': 'box-shadow' }}
        onChange   = {handleToggle}
      />
    </Tooltip>
  )
});
