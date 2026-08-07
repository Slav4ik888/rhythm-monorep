import { DashboardDataEntities, Increased } from 'entities/dashboard-data';
import { calcIncreased } from '../calc-increased';
import { getReversedIndicators } from '../get-reversed-indicators';


/**
 * v.2025-06-26
 * Calculates increased value for given item
 */
export const getIncreased = (
  inverted       : boolean,
  activeEntities : DashboardDataEntities,
  kod            : string
): Increased => {
  const data = activeEntities[kod]?.data as number[] || [];

  const [lastValue, prevValue] = getReversedIndicators(data);

  return calcIncreased(lastValue, prevValue, inverted);
}
