
export type EndingType     =  '-' | '%' | 'шт' | 'руб';
export type EndingDiffType =  '-' | '% соотношение' | 'Разница'

/**
 * DigitalIndicators settings
 */
export interface IndicatorsConfig {
  // Общие
  plusMinus?      : boolean // Если true - показывать знаки + и -
  valueNumber?    : number  // Номер значения статистики, в обратном порядке (1 - последнее, 2 - предпоследнее)
  growthColor?    : boolean // if true - зелёный при росте / красным при падении
  kfValue?        : number  // Коэффициент для преобразования значения

  // Разряды
  reduce?         : boolean // Убрать разряды: 12 500 700 => 12.5 млн
  fractionDigits? : number  // Количество знаков после запятой
  addZero?        : boolean // Добавлять ли нули после запятой, чтобы выровнить до нужного кол-ва знаков
  noSpace?        : boolean // Не добавлять пробел между разрядами

  // Ending
  endingType?     : EndingType
  endingDiffType? : EndingDiffType
}
