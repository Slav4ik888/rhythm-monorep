import { FC, memo, useCallback, MouseEvent } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { InputByScheme } from '../../../../../base-features-components';
import { ViewItemChart } from 'entities/charts';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/**
 * Ширина колонок графика
 * for Bar only
 */
export const ChartCategoryPercentage: FC<Props> = memo(({ index, selectedItem }) => {
  const { changeOneDatasetsItem } = useDashboardViewActions();

  const handleChange = useCallback((value: string | number) => {
    changeOneDatasetsItem({ field: 'categoryPercentage', value, index });
  }, [index, changeOneDatasetsItem]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle
        bold
        title     = 'Category percentage'
        toolTitle = 'Выберите ширину колонки графика (от 0 до 1)'
      />
      <InputByScheme
        type         = 'number'
        selectedItem = {selectedItem}
        scheme       = 'settings.charts'
        width        = '3rem'
        transform    = {(v) => (v as unknown as ViewItemChart[])?.[index]?.datasets?.categoryPercentage as number}
        onChange     = {() => {}}
        onBlur       = {(e: MouseEvent, v: string | number) => handleChange(v)}
        onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(v)}
      />
    </RowWrapper>
  )
});
