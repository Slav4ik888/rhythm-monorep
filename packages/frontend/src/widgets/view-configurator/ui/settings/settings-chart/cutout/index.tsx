import { FC, memo, useCallback, MouseEvent } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { InputByScheme } from '../../../base-features-components';
import { isNotPie, ViewItemChart } from 'entities/charts';
import { getDigit } from 'shared/helpers/numbers';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Глубина выреза для doughnut графика */
export const ChartCutout: FC<Props> = memo(({ selectedItem }) => {
  const { changeOneDatasetsItem } = useDashboardViewActions();

  const handleChange = useCallback((value: string | number) => {
    if (! selectedItem?.settings?.charts?.length) return // Для сохранения должен быть добавлен хотя бы 1 график

    changeOneDatasetsItem({ field: 'cutout', value: `${value}%`, index: 0 });
  }, [selectedItem?.settings?.charts?.length, changeOneDatasetsItem]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title='Cutout' toolTitle='Вырез по центру графика' />
      <Box sx={f()}>
        %
        <InputByScheme
          type         = 'number'
          selectedItem = {selectedItem}
          scheme       = 'settings.charts'
          width        = '3rem'
          transform    = {(v) => getDigit((v as unknown as ViewItemChart[] | undefined)?.[0]?.datasets?.cutout || '')}
          onChange     = {(e: MouseEvent, v: string | number) => handleChange(v)}
          onBlur       = {(e: MouseEvent, v: string | number) => handleChange(v)}
          onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(v)}
        />
      </Box>
    </RowWrapper>
  )
});
