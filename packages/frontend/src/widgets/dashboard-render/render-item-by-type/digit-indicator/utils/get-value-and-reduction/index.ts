import { addSpaceBetweenNumbers, getFixedFraction, getReducedWithReduction } from 'shared/helpers/numbers';
import { isNum } from 'shared/lib/validators';
import { ValueStringAndReduction } from '../get-comparison-values';



interface Config {
  reduce?         : boolean
  fractionDigits? : number
  addZero?        : boolean
  noSpace?        : boolean // Не нужно добавлять пробел между разрядами
}

/** Убираем разряды и определяем префикс */
export const getValueAndReduction = (startValue: number, config: Config = {} as Config): ValueStringAndReduction => {
  const { reduce, fractionDigits, addZero, noSpace } = config || {};
  let resultValue: any = startValue;
  let reduction = '';

  if (reduce) {
    const { value: v, reduction: p = '' } = getReducedWithReduction(startValue);
    resultValue = v;
    reduction = p;
  }

  // Обрабатываем десятичные
  if (isNum(resultValue)) {
    resultValue = getFixedFraction(resultValue, { fractionDigits, addZero });
  }

  return {
    reduction,
    value: noSpace ? resultValue : addSpaceBetweenNumbers(resultValue as number)
  }
}
