import { Increased } from 'entities/dashboard-data';
import { GrowType } from 'shared/types';
import { getGrowIconTypeByIncreased } from '../../../growth-icon';



const growthColors: Record<GrowType, string> = {
  growth    : '#02bf02', // Рост
  fall      : '#cc0000', // Падение
  unchanged : '#434343', // Без изменений
};

/** Цвет исходя рост или падение */
export const getColorByIncreased = (
  increased       : Increased,
  unchangedBlack? : boolean // При отсутствии изменений в результатах красить чёрным цветом
) => {
  const type = getGrowIconTypeByIncreased(increased, unchangedBlack);

  return growthColors[type];
};
