import { FC, memo } from 'react';
import Chip from '@mui/material/Chip';
import { Tooltip } from 'shared/ui/tooltip';
import { CustomTheme, useTheme } from 'app/providers/theme';
import { CONDITION_TYPE } from '../../model/config';
import { DashboardConditionType } from '../../model/types';
import { f, pxToRem } from 'shared/styles';



const useStyle = (
  { palette: { conditionTypeChip } }: CustomTheme,
  condition: DashboardConditionType = '' as DashboardConditionType
) => ({
    tooltip: {
      ...f('-c'),
      height     : pxToRem(20),
      cursor     : 'default',
    },
    chip: {
      width      : pxToRem(70),
      height     : pxToRem(15),
      fontSize   : pxToRem(12),
      color      : conditionTypeChip[condition]?.color,
      background : conditionTypeChip[condition]?.background,
    },
  });


interface Props {
  condition?: DashboardConditionType
}


/** Chip для типа состояния: Могущество | Изобилие | Норма | ЧП  | Опасность | Несущ */
export const ConditionTypeChip: FC<Props> = memo(({ condition }) => {
  const sx = useStyle(useTheme(), condition);

  if (! condition) return null

  const { label, description } = CONDITION_TYPE[condition] || {};


  return (
    <Tooltip
      title     = {description}
      placement = 'top-start'
      sxSpan    = {sx?.tooltip}
    >
      <Chip
        label = {label}
        size  = 'small'
        sx    = {sx?.chip}
      />
    </Tooltip>
  )
});
