import { FC, memo } from 'react';
import { pxToRem } from 'shared/styles';
import { DASHBOARD_PERIOD_TEXT, useDashboardData } from 'entities/dashboard-data';
import Chip from '@mui/material/Chip';



interface Props {
  onClick: () => void
}

export const PeriodTypeChip: FC<Props> = memo(({ onClick }) => {
  const { selectedPeriod } = useDashboardData();

  return (
    <Chip
      label   = {DASHBOARD_PERIOD_TEXT[selectedPeriod?.type]}
      onClick = {onClick}
      sx      = {{
        position : 'absolute',
        top      : pxToRem(3),
        right    : pxToRem(10),
        zIndex   : 10
      }}
    />
  )
});
