
/**
 * background: 'linear-gradient(195deg, #bbdefb, #64b5f6)';
 *  => ['195', '#bbdefb', '#64b5f6']
 */
export const splitGradinetHex = (str: string): string[] => {
  let result: string[] = [];
  if (! str || ! str.startsWith('linear-gradient')) return result

  result = str
    .split(',')
    .map((item, idx) => {
      const str = item.trim();

      if (idx === 0) {
        return str.split('(')?.[1]?.replace('deg', '');
      }
      return str.replace(')', '');
    });


  return result;
}
