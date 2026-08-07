import { commaToDot, delSpace } from '../replacers';


export function toNumber(str: string | number): number {
  if (typeof str === `number`) return str || 0; // if NaN
  if (typeof str !== `string`) return 0;
  if (!str) return 0;

  const dot = commaToDot(str);
  const spa = delSpace(dot);
  const num = parseFloat(spa);
  
  if (!num) return 0;
  return num;
};
