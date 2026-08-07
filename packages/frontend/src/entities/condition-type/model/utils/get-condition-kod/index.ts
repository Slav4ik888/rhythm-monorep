import { ChipType } from 'entities/dashboard-view';

/**
 * Если тип condition, а в kodе нет суффикса'-C', то добавляем его
 * для всех других типов, просто возвращаем код как есть
 */
export const getConditionKod = (type: ChipType | undefined, kod: string) => {
  if (type !== 'condition' || ! kod) return kod
  if (kod.endsWith('-C')) return kod
  return `${kod}-C`
}
