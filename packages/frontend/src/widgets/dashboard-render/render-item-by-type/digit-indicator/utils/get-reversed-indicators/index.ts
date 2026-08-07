import { toNumber } from 'shared/helpers/numbers';
import { isNum } from 'shared/lib/validators';

/**
 * @returns Array when indexes: 0 - lastValue, 1 - prevValue, 2 - nextValue
 */
export function getReversedIndicators(
  arr         : number[],
  countValues : number = 2, // Сколько значений записать
  kfValue     : number = 1, // Поправочный КФ (если нужно)
): number[] {
  const result: number[] = [];
  const count = countValues < 2 ? 2 : countValues; // Min 2

  if (! arr || ! arr.length) return result;

  const { length } = arr;
  const kf = isNum(kfValue) ? kfValue : 1;

  for (let i = 1; i <= count; i++) {
    const value = arr[length - i];
    if (i <= length) {
      const v = toNumber(value, value);
      result.push(isNum(v)
        ? v * kf
        : v
      );
    }
  }

  return result;
}
