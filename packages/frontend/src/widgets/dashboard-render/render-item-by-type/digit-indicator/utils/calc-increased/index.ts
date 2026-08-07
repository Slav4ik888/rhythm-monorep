import { Increased } from 'entities/dashboard-data';


/**
 * Если пришли undefined значения, то подставляется 0
 */
export const calcIncreased = (
  lValue      : number,
  pValue      : number,
  isInverted? : boolean // Если график перевёрнутый, то есть если задолженность уменьшается то это рост
): Increased => {
  const lastValue = lValue || 0;
  const prevValue = pValue || 0;

  return isInverted
    ? lastValue < prevValue ? 1 : lastValue !== prevValue ? -1 : 0
    : lastValue > prevValue ? 1 : lastValue !== prevValue ? -1 : 0
}
