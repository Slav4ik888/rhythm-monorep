import { Bunch } from '../../../shared/lib/structures/bunch'
import { ItemBase } from '../../base'
import { ChartConfigDatasets, ChartConfigTrendDatasets, ChartType } from './charts'
import { IndicatorsConfig } from './config'
import { ViewItemStyles } from './item-styles'

export type ViewItemType = 'box' | 'text' | 'divider' | 'chart' | 'chip' | 'growthIcon' | 'digitIndicator'


/** v.2025-05-05 */
export interface ViewItemCharts {
  kod?           : string
  chartType?     : ChartType
  datasets?      : ChartConfigDatasets
  isTrend?       : boolean // Показывать ли линию тренда
  trendDataSets? : ChartConfigTrendDatasets
}

export type ViewItemChartsField = keyof ViewItemCharts

export type ChipType = 'condition' | 'period' | 'company' | 'product' | 'custom'
export type BaseChipType = 'periodType' | 'companyType' | 'productType'

export const chipOptions: Record<ChipType, { label: string; value: ChipType }> = {
  'condition' : { label: 'Состояние',     value: 'condition' },
  'period'    : { label: 'Периодичность', value: 'period' },
  'company'   : { label: 'Компания',      value: 'company' },
  'product'   : { label: 'Продукт',       value: 'product' },
  'custom'    : { label: 'Без привязки',  value: 'custom' },
};
export const arrayChipLabel = Object.values(chipOptions).map(item => item.label);


export type ViewItemSettings = IndicatorsConfig & {
  // Global settings
  display?        : boolean // Показывать ли элемент
  kod?            : string  // Код для одиночного элемента Chip | GrowthItem |
  inverted?       : boolean // График перевёрнутый, пример - если задолженность уменьшается то это рост
  unchangedBlack? : boolean // При отсутствии изменений в результатах красить чёрным цветом

  // Chart settings
  charts?         : ViewItemCharts[]
  chartOptions?   : any // ChartConfigOptions

  // Chips settings
  chipType?       : ChipType

  // GrowthItem settings
  scale?          : number  // Изменение размера треуголька
  isLeft?         : boolean // При отсутствии изменений чёрный треугольник повернуть влево
}

export type ViewItemSettingsField = keyof ViewItemSettings;


// ------------------------------------- //
// ------------  VIEW-ITEM  ------------ //
// ----------- v.2025-06-24  ----------- //
// ------------------------------------- //

export type ViewItemId = string
export type BunchId = string

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
export type BunchesViewItem = Bunch<string, Bunch<string, ViewItem>>
