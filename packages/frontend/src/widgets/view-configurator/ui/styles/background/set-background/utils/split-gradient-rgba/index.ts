import { RgbaString } from 'entities/dashboard-view';



export interface SplittedLinerGradient extends Array<number | RgbaString> {
  0: number
  1: RgbaString
  2: RgbaString
}

/**
 * background: 'linear-gradient(195deg, rgba(255, 255, 255, 1), rgba(0, 0, 0, 1))';
 *  => ['195', 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']
 */
export const splitGradinetRgba = (str: string): SplittedLinerGradient => {
  const result = [] as unknown as SplittedLinerGradient;
  if (! str || ! str.startsWith('linear-gradient')) return result

  result.push(str.split(',')?.[0]?.replace('linear-gradient(', '')?.replace('deg', ''));

  const rgba = str.split('rgba');

  result.push(`rgba${rgba[1]?.replace('),', ')')?.trim()}`);
  result.push(`rgba${rgba[2]?.replace(')', '')}`);

  return result;
}
