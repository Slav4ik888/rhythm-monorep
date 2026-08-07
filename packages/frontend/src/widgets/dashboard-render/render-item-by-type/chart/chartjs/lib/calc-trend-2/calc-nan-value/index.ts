
/**
 * Если пустое значение NaN, то расчитывает нарастающее среднее значение по предыдущему
 * и следующему известным значениям
 * @param arr - массив значений, должен быть обработан - сначала и в конце есть значение number
 * @param value - current value
 * @param idx - index in arr
 */
export const calcNanValue = (
  arr : number[],
  v   : number,
  idx : number
): number => {
  if (! isNaN(v)) return v

  // Находим предыдущее имеющееся значение
  let prevValue = NaN;
  let prevIdx = NaN;
  for (let i = idx - 1; i >= 0; i--) {
    if (! isNaN(arr[i])) {
      prevValue = arr[i];
      prevIdx = i;
      break;
    }
  }

  // Находим следующее имеющееся значение
  let nextValue = NaN;
  let nextIdx = NaN;
  for (let i = idx + 1; i <= arr.length - 1; i++) {
    if (! isNaN(arr[i])) {
      nextValue = arr[i];
      nextIdx = i;
      break;
    }
  }

  // Наполнение массива рассчитанными значениями
  const calcValue = (prevItem: number) => prevItem + ((nextValue - prevValue) / (nextIdx - prevIdx));
  const calcArr = [calcValue(arr[prevIdx])];

  for (let i = 1; i <= nextIdx - prevIdx - 2; i++) {
    const prevItem = calcArr[i - 1];
    const value = calcValue(prevItem);

    calcArr.push(value);
  }

  const resultIdx = idx - prevIdx - 1;

  return calcArr[resultIdx];
}
