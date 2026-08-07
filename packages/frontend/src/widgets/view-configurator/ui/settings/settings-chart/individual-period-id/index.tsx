import { FC, memo } from 'react';
import { useDashboardViewState } from 'entities/dashboard-view';
import { RowInputByScheme } from '../../../base-features-components';



export const IndividualPeriodId: FC = memo(() => {
  const { selectedItem } = useDashboardViewState();

  return (
    <RowInputByScheme
      scheme       = 'settings.periodId'
      title        = 'PeriodId'
      toolTitle    = 'Id элемента "Период" для индивидуального вывода'
      width        = '100%'
      selectedItem = {selectedItem}
      onChange     = {() => { }} // Чтобы при вводе текста не происходило обновления
    />
  )
});
