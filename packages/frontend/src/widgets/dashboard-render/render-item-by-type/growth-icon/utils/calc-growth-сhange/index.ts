
/** Рассчитывает на сколько % изменился результат по сравнению с предыдущим разом */
export const calcGrowthChange = (lastValue: number, prevValue: number): number | undefined => {
  if (! prevValue) return undefined; // если нет предыдущего значения | 0

  const diff = lastValue - prevValue;

  const percent = (diff * 100) / prevValue;

  if (prevValue > 0) {
    return percent
  }

    return percent * -1
}
