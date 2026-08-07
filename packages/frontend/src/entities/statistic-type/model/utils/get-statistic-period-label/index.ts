import { CustomSettings } from 'entities/company';
import { setValue } from 'shared/helpers/objects';
import { STATISTIC_PERIOD_TYPE } from '../../config';
import { StatisticPeriodType } from '../../types';



/**
 * Вначале берёт label из customSettings
 */
export const gelStatisticPeriodLabel = (
  type            : StatisticPeriodType,
  customSettings? : CustomSettings
) => setValue(
  customSettings?.periodType?.[type]?.title,
  STATISTIC_PERIOD_TYPE[type]?.label
) || type;
