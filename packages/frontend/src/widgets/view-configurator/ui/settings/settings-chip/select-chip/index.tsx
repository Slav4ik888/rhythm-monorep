import { FC, memo, useCallback, useEffect, useState } from 'react';
import { arrayChipLabel, chipOptions, useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { SelectValue } from 'shared/ui/configurators-components/select';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Выбор ChipType */
export const SelectChipType: FC<Props> = memo(({ selectedItem }) => {
  const chipType = selectedItem?.settings?.chipType;
  const { changeOneSettingsField } = useDashboardViewActions();
  const [selectedValue, setSelectedValue] = useState(() => chipOptions[chipType || 'condition'].label);

  useEffect(() => {
    setSelectedValue(chipOptions[chipType || 'condition'].label);
  }, [chipType]);


  const handleSelectedValue = useCallback((label: string) => {
    const value = Object.values(chipOptions).find(item => item.label === label)?.value || '';
    setSelectedValue(value);
    changeOneSettingsField({ field: 'chipType', value });
  }, [changeOneSettingsField]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title='ChipType' toolTitle='Выберите тип чипа' />

      <SelectValue
        selectedValue = {selectedValue}
        array         = {arrayChipLabel}
        sx            = {{ root: { width: '10rem' } }}
        onSelect      = {handleSelectedValue}
      />
    </RowWrapper>
  )
});
