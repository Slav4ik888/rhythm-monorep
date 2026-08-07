import { useDashboardViewState } from 'entities/dashboard-view';
import { FC, memo } from 'react';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';



export const PeriodTypeRow: FC = memo(() => {
  const { selectedItem } = useDashboardViewState();

  return (
    <RowWrapper>
      <ConfiguratorTextTitle
        bold
        title     = 'Period'
        toolTitle = 'Individual period type'
      />
      {selectedItem.settings?.selectedPeriod}
    </RowWrapper>
  )
});
