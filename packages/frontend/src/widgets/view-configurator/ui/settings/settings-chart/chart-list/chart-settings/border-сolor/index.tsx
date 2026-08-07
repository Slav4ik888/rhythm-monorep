import { FC, memo, useCallback } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { ColorPicker } from 'shared/lib/colors-picker';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Цвет графика */
export const ChartBorderColor: FC<Props> = memo(({ index, selectedItem }) => {
  const { changeOneDatasetsItem } = useDashboardViewActions();

  const handleChange = useCallback((value: string | number) => {
    changeOneDatasetsItem({ field: 'borderColor', value, index });
  }, [index, changeOneDatasetsItem]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title='Border color' toolTitle='Выберите цвет графика' />
      <ColorPicker
        defaultColor = {selectedItem?.settings?.charts?.[index]?.datasets?.borderColor as string}
        onChange     = {handleChange}
      />
    </RowWrapper>
  )
});
