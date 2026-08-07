import { isDotComma, getDigit, commaToDot, dotToComma } from '../replacers';
import { addSpaceBetweenNumbers } from '../add-space-between-numbers';

/**
 * Для handleChange(e)
 * Возвращает число в строке с разделёнными тысячами
 */
export function getStrNumber(value: string): string {
  let str = ``;
  if (!value) return ``;
  
  const valInStr = value.toString();

  for (let i = 0; i < valInStr.length; i++) {
    if (isDotComma(valInStr[i])) {
      if (!isDotComma(str)) str += valInStr[i] // Comma or Dota must be one
    }
    else str += getDigit(valInStr[i]);
  }

  str = addSpaceBetweenNumbers(commaToDot(str));
  str = dotToComma(str);

  return str;
};
