import { FC, memo, useCallback, useState } from 'react';
import { SelectByScheme } from '../../../../base-features-components';
import { useDashboardData } from 'entities/dashboard-data';
import { SelectKodItem } from '../select-kod-item';
import { ViewItem } from 'entities/dashboard-view';
import { SelectKodItemSearchBox } from '../search-box';



interface Props {
  scheme       : string
  selectedItem : ViewItem | undefined
}

/** Универсальный Select для выбора Кодов в обычных ViewItem и Charts */
export const SelectKod: FC<Props> = memo(({ selectedItem, scheme }) => {
  const { kods } = useDashboardData();
  const [searcheďKods, setSearchedKods] = useState(kods);

  const handleSearch = useCallback((value: string) => {
    setSearchedKods(
      kods.filter((kod) => kod.title.toLowerCase().includes(value.toLowerCase()))
    );
  }, [kods]);

  const disabled = Boolean(selectedItem?.settings?.fromGlobalKod);

  if (disabled) return null;

  return (
    <SelectByScheme
      scheme       = {scheme}
      array        = {searcheďKods}
      component    = {SelectKodItem}
      searchBox    = {SelectKodItemSearchBox}
      onSearch     = {handleSearch}
    />
  )
});
