import { FC, memo, useCallback, MouseEvent } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { RowInputByScheme } from '../../../../../base-features-components';
import { ViewItemChart } from 'entities/charts';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Толщина линии графика */
export const ChartBorderWidth: FC<Props> = memo(({ index, selectedItem }) => {
  const { changeOneDatasetsItem } = useDashboardViewActions();

  const handleChange = useCallback((value: string | number) => {
    changeOneDatasetsItem({ field: 'borderWidth', value, index });
  },
    [index, changeOneDatasetsItem]
  );


  return (
    <RowInputByScheme
      type         = 'number'
      scheme       = 'settings.charts'
      title        ='Border width'
      toolTitle    ='Выберите толщину линии графика'
      selectedItem = {selectedItem}
      width        = '3rem'
      transform    = {(v) => (v as unknown as ViewItemChart[] | undefined)?.[index]?.datasets?.borderWidth as number}
      onChange     = {() => {}}
      onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(v)}
    />
  )
});
