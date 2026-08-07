import { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  arrayGaugeValueType, GaugeValueType, useDashboardViewActions, ViewItem
} from 'entities/dashboard-view';
import { SelectValue } from 'shared/ui/configurators-components/select';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';



interface Props {
  selectedItem: ViewItem | undefined
}

export const SelectTypeRow: FC<Props> = memo(({ selectedItem }) => {
  const type = selectedItem?.settings?.gaugeValueType || 'fractional';
  const { changeOneSettingsField } = useDashboardViewActions();
  const [selectedValue, setSelectedValue] = useState(() => type);

  useEffect(() => {
    setSelectedValue(type);
  }, [type]);


  const handleSelectedValue = useCallback((value: string) => {
    setSelectedValue(value as GaugeValueType);
    changeOneSettingsField({ field: 'gaugeValueType', value });
  },
    [changeOneSettingsField]
  );


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title='TypeValue' toolTitle='Выберите тип входящих данных' />

      <SelectValue
        selectedValue = {selectedValue}
        array         = {arrayGaugeValueType}
        sx            = {{ root: { width: '10rem' } }}
        onSelect      = {handleSelectedValue}
      />
    </RowWrapper>
  )
});
