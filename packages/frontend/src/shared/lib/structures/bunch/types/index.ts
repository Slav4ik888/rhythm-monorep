
export type BunchId = string

export type BunchAction = 'create' | 'update'
export type Bunch<IdType extends string, T> = Record<IdType, T>

/**
 * Timestamp last Bunches updated. При любом изменении ViewItems - обновляем
 * [key: BunchId]: timestamp - время последнего изменения
 */
export interface BunchesUpdated {
  [key: string]: number
}
