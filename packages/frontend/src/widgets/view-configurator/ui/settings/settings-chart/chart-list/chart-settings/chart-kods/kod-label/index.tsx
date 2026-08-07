import { FC, memo, useMemo } from 'react';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { useDashboardData } from 'entities/dashboard-data';
import Box from '@mui/material/Box';
import { getKod, useDashboardViewState, ViewItem } from 'entities/dashboard-view';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Label графика как в гугл таблице */
export const ChartKodLabel: FC<Props> = memo(({ index, selectedItem }) => {
  const { startEntities } = useDashboardData();
  const { entities } = useDashboardViewState();
  const kod = useMemo(() => getKod(entities, selectedItem, selectedItem?.settings?.charts?.[index]),
     [entities, index, selectedItem]);

  const title = useMemo(() => startEntities[kod]?.title || '', [kod, startEntities]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title='Kod label' toolTitle='Так записано название статистики в гугл файле' />
      <Box sx={{ fontSize: '1rem', cursor: 'default', textAlign: 'right' }}>
        {title}
      </Box>
    </RowWrapper>
  )
});
