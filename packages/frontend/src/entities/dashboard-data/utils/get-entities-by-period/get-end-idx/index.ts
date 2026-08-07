import { DashboardPeriodDates } from '../../../types';


/** Возвращает индекс в массиве с датами, где заканчивается подходящий нам период */
export const getEndIdx = (
  dates: number[],
  period: DashboardPeriodDates
): number => {
  if (! period?.end) return dates?.length ? dates.length - 1 : 0;

  const idx = dates?.findIndex(item => (period.end as number) < new Date(item).getTime());

  // если ничего не нашли, то возвращаем последний элемент массива
  if (idx === -1) return dates?.length ? dates.length - 1 : 0;

  return idx === 0 ? 0 : idx - 1;
}
