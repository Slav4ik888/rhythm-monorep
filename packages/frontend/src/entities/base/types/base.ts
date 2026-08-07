// Base items

// TODO: remove from this
export enum Condition {
  DRAFT     = 'draft',     // Черновик
  ACTIVE    = 'active',    // Активный
  DISABLED  = 'disabled',  // Отключенный
  SUSPENDED = 'suspended', // Приостановленный
  DELETED   = 'deleted',   // Удалённый
}


export type Email = string


/** Тип для фиксирования даты */
export interface FixDate {
  userId : string // Кто создал или сделал изменение
  date   : number // Дата события
}


// Изменение (зафиксировать что именно изменили TODO: алгоритм этого)
export interface Change extends FixDate {
  body: string
}


/*
 * 2024-03-30
 * For: USER, DOCUMENT, SECTION, RULE, POSITION
 */
export interface ItemBase {
  id           : string // Id
  condition?   : Condition
  parentId?    : string // Id parent
  label?       : string // Заголовок
  description? : string // Описание
  comment?     : string // Additional field, for comment for this item

  /**
   * Сортировка среди своих же братьев
   * При перемещении к новому родителю, ставиться в начало списка
   */
  order        : number
  display?     : boolean // Видимый или невидимый (удалённый) элемент

  // changes?     : Array<Change>, // Сохранённые предыдущие состояния
  createdAt    : FixDate
  lastChange   : FixDate
}
