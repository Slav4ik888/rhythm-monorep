import { ItemBase } from 'entities/base'
import { PartialViewItemUpdate } from 'shared/api/features/dashboard-view'
import { Bunch, BunchId } from 'shared/lib/structures'
import { ViewItemStyles } from './item-styles'
import { ViewItemSettings } from './view-item-settings'



export type ViewItemType =
  | 'box'            // Контейнер для других элементов и их позиционирования
  | 'text'           // Текст
  | 'divider'        // Линия разделитель
  | 'icon'           // Иконка
  | 'chart'          // График
  | 'period'         // Коробка с массивом индивидуальных периодов, которые можно выбирать для графика
  | 'chip'           // Текст в обводке (для отображения типов: Компании | Продукты | Состояния деятельности)
  | 'growthIcon'     // Треугольник (рост/падение)
  | 'digitIndicator' // Цифровой индикатор
  | 'gaugeColumn'    // Колонка-диаграмма
  | 'list'           // Список строк из текстовой строки с разделителем ', '



// ------------------------------------- //
// ------------  VIEW-ITEM  ------------ //
// ----------- v.2025-06-24  ----------- //
// ------------------------------------- //

export type ViewItemId = string

export interface ViewItem extends ItemBase {
  id           : ViewItemId
  bunchId      : BunchId
  parentId     : ViewItemId | 'no_parentId' // 'no_parentId' для корневых элементов
  sheetId      : ViewItemId // Main sheet id === ''

  type         : ViewItemType
  styles       : ViewItemStyles

  settings?    : ViewItemSettings
}

export type PartialViewItem = Partial<ViewItem> & { id: ViewItemId }

export type BunchesViewItem        = Bunch<string, Bunch<string, ViewItem>>
// Для обновления изменения в элементах
export type PartialBunchesViewItem = Bunch<string, Bunch<string, PartialViewItemUpdate>>
