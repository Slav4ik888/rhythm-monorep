// @ts-ignore
import { InteractionMode } from 'node_modules/chart.js/dist/types/index.d.ts';
import { ChartFontStyle, ChartType, LegendPosition, ScaleYPosition } from './chart-types';



export interface ChartConfigDatasets {
  label?                : string
  data                  : number[] // Данные
  tension?              : number // Индивидуальное скругление углов, по умолчанию 0
  pointRadius?          : number // Толщика точки (круглешков)
  pointBorderColor?     : string | 'transparent'
  pointBackgroundColor? : string
  borderColor?          : string | string[] // Несколько цветов [], если нужно каждый столбик раскрасить разным цветом
  borderWidth?          : number // Толщика линии
  backgroundColor?      : string | string[] // Несколько цветов [], если нужно каждый столбик раскрасить разным цветом
  fill?                 : boolean
  maxBarThickness?      : number
  barPercentage?        : number // For Bar - Ширина колонок графика
  categoryPercentage?   : number // For Bar - Ширина колонок графика

  type?                 : ChartType // Если на 1 графике несколько Charts и 1й 'bar', but not 'line'
  // Если на 1 графике несколько Charts, то упорядочиваются они
  // изменением местоположения (перемещением) в массиве charts.
  // order нужно оставить для вывода тренда поверх parent графика
  order?                : number
  parentChartsIdx?      : number  // For trendLine чтобы знать чей это тренд charts
  cutout?               : string  // Doughnut in percent
  hoverOffset?          : number  // For Doughnut
  spanGaps?             : boolean // For Line соединять линию есть есть пропуск NaN
  shiftValues?          : number  // Для сдвига графика (выше или ниже)
  hidden?               : boolean // Скрытие графика
}

// Для Тренда
export interface ChartConfigTrendDatasets {
  data?                 : number[] // Данные
  borderColor?          : string
  borderWidth?          : number // Толщика линии
}

export type ChartConfigDatasetsField = keyof ChartConfigDatasets;


export interface ChartConfigOptions {
  responsive?          : boolean

  aspectRatio?         : number // или другое значение, которое вам подходит
  maintainAspectRatio? : boolean // важно отключить это свойство, если хотите изменить размер диаграммы

  tension?             : number // Глобальное скругление углов, по умолчанию 0

  plugins?: {
    legend?: {
      display?  : boolean
      position? : LegendPosition
      align?    : 'start' | 'center' | 'end'
    }
  }
  interaction?: {
    intersect? : boolean  // true - событие срабатывает только если курсор пересекает элемент (например, находится прямо над точкой или столбцом)
    mode?      : InteractionMode // 'index'
  }

  scales?: {
    y?: {
      display?  : boolean
      position? : ScaleYPosition, // Положение оси Y слева по умолчанию

      // Вертикальные линии на оси
      grid?: {
        drawBorder?      : boolean
        display?         : boolean
        drawOnChartArea? : boolean
        drawTicks?       : boolean
        borderDash?      : [number, number]
        color?           : string
      }
      // Подпись оси
      ticks?: {
        display? : boolean
        color?   : string
        padding? : number
        font?    : {
          size?       : number
          weight?     : number
          family?     : 'Roboto' | 'Arial'
          style?      : ChartFontStyle
          lineHeight? : number
        }
      }
      beginAtZero?  : boolean // y axis starts at 0
      suggestedMin? : number | undefined
      suggestedMax? : number | undefined
      min?          : number | undefined
      max?          : number | undefined
      // Borders
      border?: {
        display? : boolean
        color?   : string
      }
    }
    x?: {
      display?: boolean
      // Горизонтальные линии на оси
      grid?: {
        drawBorder?      : boolean
        display?         : boolean
        drawOnChartArea? : boolean
        drawTicks?       : boolean
        borderDash?      : [number, number]
        color?           : string
      }
      // Подпись оси
      ticks?: {
        display?       : boolean
        color?         : string
        padding?       : number
        maxTicksLimit? : number // Максимальное кол-во подписей
        minRotation?   : number // Мин угол поворота. 0 - текст строго горизонтальный
        maxRotation?   : number // Макс угол поворота

        font?: {
          size?       : number
          weight?     : number
          family?     : 'Roboto' | 'Arial'
          style?      : ChartFontStyle
          lineHeight? : number
        }
      }
      // Borders
      border?: {
        display? : boolean
        color?   : string
      }
    }
  }
}


export interface ChartConfig {
  labels   : any[] // Dates (метки на оси X)
  datasets : ChartConfigDatasets[]
  options? : ChartConfigOptions
}
