import { GaugeColumnItem } from 'entities/dashboard-view';



/**
 * Находит первое удовлетворяющее условие
 */
export function getSuitableGaugeColumnItem(
  currentValue     : number, // ожидается значение от _ до _
  gaugeColumnItems : GaugeColumnItem[] = []
): GaugeColumnItem | undefined {
  return gaugeColumnItems.find((item) => {
    const valueMore = item.valueMore !== undefined && item.valueMore !== ''
      ? (typeof item.valueMore === 'number' ? item.valueMore : parseFloat(item.valueMore as string))
      : -Infinity;

    const valueLess = item.valueLess !== undefined && item.valueLess !== ''
      ? (typeof item.valueLess === 'number' ? item.valueLess : parseFloat(item.valueLess as string))
      : Infinity;

    // Если оба значения невалидны (пустые строки или undefined), элемент не подходит
    if (valueMore === -Infinity && valueLess === Infinity) {
      return false;
    }

    return currentValue >= valueMore && currentValue < valueLess;
  });
}
