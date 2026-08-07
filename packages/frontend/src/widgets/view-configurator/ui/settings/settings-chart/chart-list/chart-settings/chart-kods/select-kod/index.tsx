import { FC, memo, useMemo } from 'react';
import { getKod, useDashboardViewState, ViewItem } from 'entities/dashboard-view';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { useDashboardData } from 'entities/dashboard-data';
import { StatisticPeriodTypeChip } from 'entities/statistic-type';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { Tooltip } from 'shared/ui/tooltip';
import { GetFromGlobalKod } from '../../../../../../base-features-components';
import { FlagFromGlobalKod, SelectKod } from '../../../../../base-components';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Выбор кода */
export const ChartSelectKod: FC<Props> = memo(({ index, selectedItem }) => {
  const { startEntities } = useDashboardData();
  const { entities } = useDashboardViewState();

  const kod = useMemo(() => getKod(entities, selectedItem, selectedItem?.settings?.charts?.[index]),
    [entities, index, selectedItem]);

  const disabled = selectedItem?.settings?.charts?.[index]?.fromGlobalKod;

  return (
    <RowWrapperTitle boldTitle title='Код' toolTitle='Укажите код статистики для графика'>
      <Box sx={{ ...f('-c-c'), gap: 1 }}>
        <FlagFromGlobalKod scheme={`settings.charts.[${index}].fromGlobalKod`} />
        <StatisticPeriodTypeChip type={startEntities[kod]?.periodType} />
        {
          disabled
            ? <Tooltip title='Чтобы выбрать другой код, снимите галку с "fromGlobalKod".'>
                <GetFromGlobalKod />
              </Tooltip>
            : <SelectKod
                scheme       = {`settings.charts.[${index}].kod`}
                selectedItem = {selectedItem}
              />
        }
      </Box>
    </RowWrapperTitle>
  )
});
