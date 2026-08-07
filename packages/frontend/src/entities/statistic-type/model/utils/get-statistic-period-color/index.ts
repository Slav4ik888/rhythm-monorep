import { CustomTheme } from 'app/providers/theme';
import { CustomSettings } from 'entities/company';
import { setValue } from 'shared/helpers/objects';
import { StatisticPeriodType } from '../../types';



/**
 * Вначале берёт цвета из customSettings
 */
export const gelStatisticPeriodColor = (
  name            : 'color' | 'background',
  type            : StatisticPeriodType,
  theme           : CustomTheme,
  customSettings? : CustomSettings
) => setValue(
  customSettings?.periodType?.[type]?.[name],
  theme.palette.statisticPeriodTypeChip[type]?.[name]
) || (name === 'color' ? '#111111' : '#eee');
