import { isNum } from 'shared/lib/validators';



/**
 * Удаляет вначале и вконце  не цифровые значения NaN | ""
 */
export const removeBorderlineEmptyValues = (arr: any[]): any[] => {
  let startNumberIdx: number = -1;

  for (let i = 0; i < arr.length; i++) {
    if (! isNaN(arr[i]) && isNum(arr[i])) {
      startNumberIdx = i;
      break
    }
  }

  if (startNumberIdx === -1) return []

  let endNumberIdx: number = -1;
  for (let i = arr.length - 1; i >= startNumberIdx; i--) {
    if (! isNaN(arr[i]) && isNum(arr[i])) {
      endNumberIdx = i;
      break
    }
  }

  return arr.slice(startNumberIdx, endNumberIdx + 1);
}
