/**
 * Значения отражает наоборот.
 * Для перевёрнутых графиков
 */
export const invertData = (data: number[]): number[] => {
  if (! data?.length) return [];

  return data.map((x) => x ? x * -1 : x);
}
