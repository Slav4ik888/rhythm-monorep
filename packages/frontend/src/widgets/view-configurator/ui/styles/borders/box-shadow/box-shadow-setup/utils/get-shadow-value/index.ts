import { splitShadow } from '../split-shadow';


/** По индексу, возвращает цифровое значение теней или цвет */
export const getBoxShadowValue = (
  index: number,
  value: number | string | undefined = ''
): number | string => {
  const [oX = 1, oY = 1, bR = 3, sR = 0, clr = 'rgba(184, 184, 184, 1)'] = splitShadow(value);

  switch (index) {
    case 0: return Number(oX);
    case 1: return Number(oY);
    case 2: return Number(bR);
    case 3: return Number(sR);
    default: return clr;
  }
}
