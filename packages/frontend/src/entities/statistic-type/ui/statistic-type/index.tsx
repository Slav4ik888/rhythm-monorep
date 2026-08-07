import { FC, memo } from 'react';
import Chip from '@mui/material/Chip';
import { StatisticPeriodType } from '../../model/types';
import { CustomTheme } from 'app/providers/theme';
import { pxToRem, SxCard } from 'shared/styles';
import { CustomSettings } from 'entities/company';
import { gelStatisticPeriodLabel, gelStatisticPeriodColor } from '../../model/utils';



interface Props {
  type?           : StatisticPeriodType
  customSettings? : CustomSettings
  sx?             : SxCard
}


/**
 * Chip для типа статистики: День | Нед | Мес
 */
export const StatisticPeriodTypeChip: FC<Props> = memo(({ type = '' as StatisticPeriodType, customSettings, sx }) => (
  <Chip
    label = {gelStatisticPeriodLabel(type, customSettings)}
    size  = 'small'
    sx    = {(theme) => ({
      width      : pxToRem(70),
      height     : pxToRem(18),
      fontSize   : pxToRem(12),
      cursor     : 'default',
      color      : gelStatisticPeriodColor('color', type, theme as CustomTheme, customSettings),
      background : gelStatisticPeriodColor('background', type, theme as CustomTheme, customSettings),

      '&:hover': {
        background: gelStatisticPeriodColor('background', type, theme as CustomTheme, customSettings),
      },
      ...sx?.root,
    })}
  />
));
