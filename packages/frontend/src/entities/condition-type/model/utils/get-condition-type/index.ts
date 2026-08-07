import { getLastItem } from 'shared/helpers/arrays';
import { DashboardConditionType } from '../../types';



/** Вместо пришедшего состояния из таблицы, возвращает DashboardConditionType */
const getConditionTypeByString = (condition?: string): DashboardConditionType => {
  switch (condition) {
    case 'Могущество': return DashboardConditionType.POWER;
    case 'Изобилие':   return DashboardConditionType.ABUNDANCE;
    case 'Норма':      return DashboardConditionType.NORMAL;
    case 'ЧП':         return DashboardConditionType.EMERGENCY;
    case 'Опасность':  return DashboardConditionType.DANGER;
    case 'Несущ':      return DashboardConditionType.NON_EXISTENCE;
    case '':           return DashboardConditionType.NULL;

    default: return DashboardConditionType.ANY;
  }
}

/**
 * Возвращает последний DashboardConditionType
 */
export const getConditionType = (data: any[]): DashboardConditionType => {
  const lastItem = getLastItem(data);

  return getConditionTypeByString(lastItem);
}
