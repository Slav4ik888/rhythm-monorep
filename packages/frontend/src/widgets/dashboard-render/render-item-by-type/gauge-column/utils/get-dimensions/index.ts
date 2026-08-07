import { ViewItem } from 'entities/dashboard-view';
import { isNum } from 'shared/lib/validators';



export const getKfCorrect = (item: ViewItem): number => {
  const isInteger = item.settings?.gaugeValueType === 'integer'; // По умолчанию (при отсутствии) это fractional
  return isInteger ? 0.01 : 1; // Целые значения делим на 100, чтобы привести к дробному значению
};

export const getWidth = (item: ViewItem, defaultValue: number) => isNum(item.styles.width) && item.styles.width
  ? item.styles.width as number
  : defaultValue;

export const getHeight = (item: ViewItem, defaultValue: number) => isNum(item.styles.height) && item.styles.height
  ? item.styles.height as number
  : defaultValue;
