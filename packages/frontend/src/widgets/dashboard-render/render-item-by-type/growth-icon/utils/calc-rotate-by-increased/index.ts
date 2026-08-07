import { Increased } from 'entities/dashboard-data';



export const calcRotateByIncreased = (
  increased      : Increased,
  isLeft         : boolean | undefined  // При отсутствии изменений чёрный треугольник повернуть влево
): number => {
  switch (increased) {
    case 1  : return 0
    case -1 : return 180
    default : return isLeft
      ? -90
      : 180
  }
};
