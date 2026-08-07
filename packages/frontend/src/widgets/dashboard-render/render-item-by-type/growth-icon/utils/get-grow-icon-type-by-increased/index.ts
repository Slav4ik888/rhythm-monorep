import { Increased } from 'entities/dashboard-data';
import { GrowType } from 'shared/types';



export const getGrowIconTypeByIncreased = (
  increased       : Increased,
  unchangedBlack? : boolean // При отсутствии изменений в результатах красить чёрным цветом
): GrowType => {
  switch (increased) {
    case 1  : return 'growth'
    case -1 : return 'fall'
    default : return unchangedBlack ? 'unchanged' : 'fall'
  }
};
