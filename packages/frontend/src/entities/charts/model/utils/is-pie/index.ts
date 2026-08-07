import { ViewItem } from 'entities/dashboard-view';

/** Is pie | doughnut */
export const isPie = (selectedItem: ViewItem | undefined): boolean => {
  const chartType = selectedItem?.settings?.charts?.[0]?.chartType;

  return chartType === 'doughnut' || chartType === 'pie';
}

/** Is not pie && doughnut */
export const isNotPie = (selectedItem: ViewItem | undefined): boolean => !isPie(selectedItem);
