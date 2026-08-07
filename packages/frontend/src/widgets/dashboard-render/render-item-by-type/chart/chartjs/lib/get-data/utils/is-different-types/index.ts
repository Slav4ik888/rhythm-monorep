import { DashboardStatisticItem } from 'entities/dashboard-data'

/**
 * НЕ ИСПОЛЬЗУЕТСЯ
 * Есть ли различия между periodType во всех выбранных кодах статистик
 */
export const isDifferentTypes = (itemsData: DashboardStatisticItem<number>[]) => {
  if (! itemsData || ! itemsData.length) return false

  return itemsData.some(item => item.periodType !== itemsData[0].periodType)
}
