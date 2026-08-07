import { Increased } from 'entities/dashboard-data';
import { ViewItem } from 'entities/dashboard-view';
import { getColorByIncreased } from '../../utils';



export const getStyles = (item: ViewItem, increased: Increased) => {
  let color = '';

  // Если указано что цвет по росту/падению
  if (item?.settings?.growthColor) {
    color = getColorByIncreased(increased, item?.settings?.unchangedBlack);
  }
  else if (item?.styles?.color) {
    color = item?.styles?.color;
  }

  return color
};
