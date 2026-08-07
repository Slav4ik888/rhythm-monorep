import { getColorByIncreased } from '../../digit-indicator/utils';
import { Increased } from 'entities/dashboard-data';
import { calcRotateByIncreased } from '../utils';


export const getStyles = (
  increased      : Increased,
  unchangedBlack : boolean | undefined,
  scaleValue     : number  | undefined,
  isLeft         : boolean | undefined  // При отсутствии изменений чёрный треугольник повернуть влево
) => {
  const color = getColorByIncreased(increased, unchangedBlack);
  const transformValue = `scale(${scaleValue || 1}) rotate(${calcRotateByIncreased(increased, isLeft)}deg)`;

  return {
    svg: {
      transform       : transformValue,
      WebkitTransform : transformValue,
      MozTransform    : transformValue,
      color
    },
    fill: color,
  };
};
