import { ViewItem } from 'entities/dashboard-view';
import { getCircularValue } from 'shared/helpers/arrays';
import { isStr } from 'shared/lib/validators';



export const TEMPLATE_COLORS = [
  'rgb(30, 160, 16)',
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)',
  'rgb(162, 12, 150)',
  'rgb(202, 90, 21)',
];

export const getBackgroundColors = (viewItem: ViewItem): string[] => viewItem?.settings?.charts?.map((item, idx) => {
    const color = item?.datasets?.backgroundColor;

    if (isStr(color)) return color as unknown as string

    return getCircularValue(TEMPLATE_COLORS, idx) as string;
  }) || TEMPLATE_COLORS
