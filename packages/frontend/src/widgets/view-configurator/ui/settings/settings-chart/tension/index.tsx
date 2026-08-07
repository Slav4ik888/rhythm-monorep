import { FC, memo, useCallback, MouseEvent } from 'react';
import { RowInputByScheme } from '../../../base-features-components';
import { useDashboardViewActions } from 'entities/dashboard-view';
import { ViewItemChart } from 'entities/charts';
import { isNotUndefined } from 'shared/lib/validators';



interface Props {
  index? : number // Если указан, значит индивидуальный
}

/** Настройки tension глобально для всего графика и индивидуально */
export const ViewItemChartTension: FC<Props> = memo(({ index }) => {
  const { selectedItem, changeOneDatasetsItem } = useDashboardViewActions();

  const handleChange = useCallback((value: string | number) => {
    changeOneDatasetsItem({ field: 'tension', value, index: index as number });
  },
    [index, changeOneDatasetsItem]
  );


  return (
    <>
      {
        isNotUndefined(index)
          ? <RowInputByScheme
              type         = 'number'
              scheme       = 'settings.charts'
              title        = 'Tension'
              toolTitle    = 'Индивидуальное скругление углов графика (от 0 до 1). По умолчанию 0.'
              selectedItem = {selectedItem}
              width        = '3rem'
              clear        = {null}
              transform    = {(v) => (v as unknown as ViewItemChart[])?.[index as number]?.datasets?.tension as number}
              onChange     = {() => {}}
              onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(v)}
            />
          : <RowInputByScheme
              type         = 'number'
              scheme       = 'settings.chartOptions.tension'
              title        = 'Tension'
              toolTitle    = 'Глобальное скругление углов графика (от 0 до 1). По умолчанию 0.'
              width        = '3rem'
              clear        = {null}
              selectedItem = {selectedItem}
              onChange     = {() => {}}
            />
      }
    </>
  )
});
