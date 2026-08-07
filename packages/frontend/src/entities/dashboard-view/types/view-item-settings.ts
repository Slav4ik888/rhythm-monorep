import { ChartConfigOptions, ViewItemChart } from 'entities/charts'
import { DefaultIconId } from 'shared/lib/icons'
import { ViewItemId } from '.'
import { GaugeColumnItem } from './gauge-column-item'
import { IndicatorsConfig } from './indicators-config'
import { Periods, PeriodStyles } from './period'



export type ChipType          = 'condition'  | 'period'      | 'company'     | 'product' | 'custom'
export type BaseChipType      = 'periodType' | 'companyType' | 'productType'
export type SettingsDirection = 'horizontal' | 'vertical'
export type GaugeValueType    = 'integer'    | 'fractional'


/** v.2025-08-09 */
export type ViewItemSettings = IndicatorsConfig & {
  // Global settings
  display?              : boolean // Показывать ли элемент
  toolTitle?            : string  // Пользовательская всплывающая подсказка (описание)

  // Kod settings
  kod?                  : string  // Код для одиночного элемента Box | Chip | GrowthItem | Indicator

  /** Если true, то это kod, будет автоматически подтягиваться всем children где стоит галка (fromGlobalKod) */
  isGlobalKod?          : boolean

  /** Если true, то это Глобальны kod, будет автоматически подтягиваться в этот элемент */
  fromGlobalKod?        : boolean

  /** Если true, то всем children, у которых где стоит галка (fromGlobalInverted), примениться inverted = true */
  globalInverted?       : boolean

  inverted?             : boolean // Значения переворачиваются в противоположное, пример - если задолженность уменьшается то это рост
  unchangedBlack?       : boolean // При отсутствии изменений в результатах красить чёрным цветом

  // Icon
  iconId?               : DefaultIconId | null // Id иконки (которые из приложения)

  // Chart settings
  charts?               : ViewItemChart[]
  chartOptions?         : ChartConfigOptions
  periodId?             : ViewItemId // Id элемента, из которого брать данные по индивидуально выбранному периоду

  // Period settings
  selectedPeriod?       : string // Выбранный индивидуальный период (берётся из этого элемента по его Id)
  periods?              : Periods

  // Chips settings
  chipType?             : ChipType

  // GrowthItem settings
  scale?                : number  // Изменение размера треуголька
  isLeft?               : boolean // При отсутствии изменений чёрный треугольник повернуть влево

  // GaugeColumn
  gaugeValueType?       : GaugeValueType    // Целые или дробные значения, по умолчанию fractional
  gaugeColumnItems?     : GaugeColumnItem[]
  direction?            : SettingsDirection // Default 'horizontal'
  displayParameters?    : boolean           // Показтать метки с выбранными параметрами на gaugeColumn
  parametersLabelColor? : string            // Цвет меток параметров на gaugeColumn
  displayResult?        : boolean           // Показать результат на gaugeColumn
}

export type ViewItemSettingsField = keyof ViewItemSettings
