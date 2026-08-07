import { isNum } from 'shared/lib/validators';
import { calcNanValue } from './calc-nan-value';
import { preserveNaNPositions } from './preserve-nan-positions';
import { removeBorderlineEmptyValues } from './remove-borderline-empty-values';


/** Сумма значений массива */
const sum = (arr: number[]): number => arr.reduce((prev, val) => prev + val, 0);


/**
 * Расчитывает значения для линейного тренда
 *  - если значение отсутствует (пропуск) то это учитывается
 * @param dates
 * @param items
 * @returns items for trend-line
 */
export const calcTrend2 = (
  dates : string[],
  items : number[],
): number[] => {
  if (! dates || ! dates.length || ! items || ! items.length) return []

  // Удаляем вначале и конце не цифровые значения
  // Приводим все значения к цифрам, if '' (empty) => NaN

  const yClear = removeBorderlineEmptyValues(items).map(v => isNum(v) ? v : NaN);
  const y = yClear.map((v, i) => calcNanValue(yClear, v, i)); // 10 0 3 6 9 12 15 35 25 15

  // Количество точек данных
  // const n = dates.length; // 7
  const n = y.length; // 10

  // ∑x суммы значений => 1 + 2 + 3 + 4...
  const x = dates.map((v, i) => i + 1).slice(0, n); // [1, 2, 3, 4, 5]
  const sumX = sum(x); // 55

  // ∑y суммы значений
  const sumY = sum(y); // 130

  // ∑xy сумма произведений
  const xy = x.map((v, i) => v * y[i]); // 10 0 9 24 45 72 105 280 225 150
  const sumXY = sum(xy); // 920

  // ∑x2 сумма квадратов значений
  const x2 = x.map(v => v * v); // 1 4 9 16 25 36 49 64 81 100
  const sumX2 = sum(x2); // 385

  // Формула линейного тренда:  y = mx + b
  // ---------------------------------------
  // m — наклон линии (скорость изменения)
  const mChisl = n * sumXY - sumX * sumY; // 2050
  const mZnam  = n * sumX2 - sumX * sumX; // 825
  const m = mChisl / mZnam; // 2,48485

  // b — точка пересечения с осью
  const bChisl = sumY - m * sumX; // -6,666666667
  const bZnam  = n; // 10
  const b = bChisl / bZnam; // -0,67

  // y — прогнозируемое значение
  // x — момент времени
  const result = x.map(valueX => m * valueX + b);

  return preserveNaNPositions(items, result)
}
