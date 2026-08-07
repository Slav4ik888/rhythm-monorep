import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useDashboardViewActions } from 'entities/dashboard-view';
import { SelectValue } from 'shared/ui/configurators-components/select';
import { getValueByScheme } from 'shared/helpers/objects';
import { updater } from '../utils';



interface Props {
  scheme       : string
  array        : string[] | any[] // any if component present
  searchBox?   : FC<any> // Если нужен не стандартный поиск in SelectValue
  component?   : FC<any> // Если нужен не стандартный компонент вместо item
  disabled?    : boolean
  onSearch?    : (value: string) => void
}

/**
 * Выбор ByScheme и сохраняет по схеме измененя в selectedItem
 * в том числе scheme with array
 */
export const SelectByScheme: FC<Props> = memo(({ scheme, array, disabled, component, searchBox, onSearch }) => {
  const { selectedItem, updateViewItems } = useDashboardViewActions();
  const [selectedValue, setSelectedValue] = useState(getValueByScheme(selectedItem, scheme) || '');

  useEffect(() => {
    setSelectedValue(getValueByScheme(selectedItem, scheme) || '');
  }, [selectedItem, scheme, setSelectedValue]);

  const handleUpdate = useCallback((v: string | number) => {
    updater(v, selectedItem, scheme, updateViewItems);
  }, [selectedItem, scheme, updateViewItems]);


  return (
    <SelectValue
      selectedValue = {selectedValue}
      disabled      = {disabled}
      array         = {array}
      component     = {component}
      searchBox     = {searchBox}
      onSelect      = {handleUpdate}
      onSearch      = {onSearch}
    />
  )
});
