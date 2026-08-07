import { IndicatorsConfig } from 'entities/dashboard-view';
import { getValueAndReduction } from '../get-value-and-reduction';


export interface ValueStringAndReduction {
  value     : string
  reduction : string
}

/** Показатели для сравнения */
export const getComparisonValues = (
  values : number[],
  count  : number = 2,
  config : IndicatorsConfig = {}
): ValueStringAndReduction[] => values
    .slice(0, count < 2 ? 2 : count) // Оставляем нужное кол-во значений, минимум 2
    .map(startValue => getValueAndReduction(startValue, config));
