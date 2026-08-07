import { FC, memo, useCallback, MouseEvent } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { InputByScheme } from '../../../../../base-features-components';
import { pxToRem } from 'shared/styles';
import { ViewItemChart } from 'entities/charts';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Выбор legend label графика */
export const ChartLabel: FC<Props> = memo(({ index, selectedItem }) => {
  const { changeOneDatasetsItem } = useDashboardViewActions();

  const handleChange = useCallback((value: string | number) => {
    changeOneDatasetsItem({ field: 'label', value, index });
  }, [index, changeOneDatasetsItem]);

  // Скрывать если галочка не стоит
  // if (! Boolean(selectedItem.settings?.chartOptions?.plugins?.legend?.display)) return null


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title='Chart label' toolTitle='Выберите метку для графика' />
      <InputByScheme
        scheme       = 'settings.charts'
        selectedItem = {selectedItem}
        width        = '100%'
        sx           = {{ field: { height: pxToRem(40) } }}
        transform    = {(v) => (v as unknown as ViewItemChart[] | undefined)?.[index]?.datasets?.label as string}
        onChange     = {(e: MouseEvent, v: string | number) => {}}
        onBlur       = {(e: MouseEvent, v: string | number) => handleChange(v)}
        onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(v)}
      />
    </RowWrapper>
  )
});
