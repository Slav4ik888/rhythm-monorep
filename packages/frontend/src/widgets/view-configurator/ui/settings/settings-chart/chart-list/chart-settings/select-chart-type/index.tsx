import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper, SelectValue } from 'shared/ui/configurators-components';
import { arrChartType, ChartType, isPie } from 'entities/charts';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Выбор типа графика */
export const SelectChartType: FC<Props> = memo(({ index, selectedItem }) => {
  const chartType = selectedItem?.settings?.charts?.[index]?.chartType;

  const { newStoredViewItem, changeOneChartsItem } = useDashboardViewActions();
  const [selectedValue, setSelectedValue] = useState<ChartType>(chartType || 'line');

  useEffect(() => {
    setSelectedValue(chartType || 'line');
  }, [chartType]);


  const handleSelectedValue = useCallback((value: string) => {
    // Если уже doughnut то изменить можно или на doughnut или pie
    if (isPie(newStoredViewItem) && value !== 'pie' && value !== 'doughnut') return
    setSelectedValue(value as ChartType);
    changeOneChartsItem({ field: 'chartType', value, index });
  }, [index, newStoredViewItem, changeOneChartsItem, setSelectedValue]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title='ChartType' toolTitle='Выберите тип графика' />

      <SelectValue
        selectedValue = {selectedValue}
        array         = {arrChartType}
        onSelect      = {handleSelectedValue}
      />
    </RowWrapper>
  )
});
