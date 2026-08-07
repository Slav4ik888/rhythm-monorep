import { RgbaString } from 'entities/dashboard-view';
import { RgbaColor } from 'react-colorful';
import { isNotUndefined } from '../../../validators';



/**
 * background: 'rgba(255, 255, 255, 1)';
 *  => { r: 255, g: 255, b: 255, a: 1 }
 */
export function rgbaStringToRgba(color: RgbaString): RgbaColor | undefined {
  if (! color || ! color.startsWith('rgba')) return undefined

  let result: RgbaColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };

  const res = color.replace('rgba(', '').replace(')', '').split(',');

  result = {
    r: parseInt(res[0], 10)   || 0,
    g: parseInt(res[1], 10)   || 0,
    b: parseInt(res[2], 10)   || 0,
    a: isNotUndefined(parseFloat(res[3])) ? parseFloat(res[3]) : 1,
  };

  return result;
}
