import { FC, memo, useCallback, useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { ViewItemStylesField, ViewItem } from 'entities/dashboard-view';
import { BoxShadowSetupContainer } from './box-shadow-setup';
import { Tooltip } from 'shared/ui/tooltip';



interface Props {
  field        : ViewItemStylesField
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** box-shadow */
export const BoxShadowRow: FC<Props> = memo(({ field, selectedItem, onChange }) => {
  const [checked, setChecked] = useState(Boolean(selectedItem?.styles?.[field]));

  useEffect(() => {
    setChecked(Boolean(selectedItem?.styles?.[field]));
  },
    [field, selectedItem, setChecked]
  );


  const handleToggle = useCallback(() => {
    if (selectedItem?.styles?.[field]) {
      onChange(field, '', 'BoxShadowRow');
    }
    else {
      onChange(field, '1px 1px 3px 0px rgba(184, 184, 184, 1)', 'BoxShadowRow');
      setChecked(true);
    }
  },
    [field, selectedItem, onChange, setChecked]
  );


  return (
    <RowWrapper>
      <ConfiguratorTextTitle
        bold
        title     = 'box-shadow'
        toolTitle = {`1px 1px 3px 0px rgba(184, 184, 184, 1) =>
        offset-x | offset-y | blur-radius | spread-radius | color`}
      />
      <Tooltip title={`${checked ? 'Отключить' : 'Включить'} тень`}>
        <Checkbox
          size       = 'small'
          checked    = {checked}
          inputProps = {{ 'aria-label': 'box-shadow' }}
          onChange   = {handleToggle}
        />
      </Tooltip>
      {
        checked
          ? <BoxShadowSetupContainer
              field        = {field}
              selectedItem = {selectedItem}
              onChange     = {onChange}
            />
          : null
      }
    </RowWrapper>
  )
});
