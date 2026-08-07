import { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  arraySettingsDirection, SettingsDirection, useDashboardViewActions, ViewItem
} from 'entities/dashboard-view';
import { SelectValue } from 'shared/ui/configurators-components/select';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';



export const SelectDirectionRow: FC = memo(() => {
  const { selectedItem, changeOneSettingsField } = useDashboardViewActions();
  const direction = selectedItem?.settings?.direction || 'horizontal';
  const [selectedValue, setSelectedValue] = useState(() => direction);

  useEffect(() => {
    setSelectedValue(direction);
  }, [direction]);


  const handleSelectedValue = useCallback((value: string) => {
    setSelectedValue(value as SettingsDirection);
    changeOneSettingsField({ field: 'direction', value });
  },
    [changeOneSettingsField]
  );


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title='Direction' toolTitle='Выберите направление колонки' />

      <SelectValue
        selectedValue = {selectedValue}
        array         = {arraySettingsDirection}
        sx            = {{ root: { width: '10rem' } }}
        onSelect      = {handleSelectedValue}
      />
    </RowWrapper>
  )
});
