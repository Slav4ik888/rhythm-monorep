/**
 * v.2023-05-28
 * Object value by scheme, else false
 * Поддерживает только вложенные объекты, not arrays
 * max вложенность = 8
 */
export function getValueByScheme<O extends object>(obj: O, scheme: string): any {
  if (! obj || ! scheme) return undefined;
  

  const fields = scheme.split('.');

  if (fields.length === 0 || fields.length > 8) return undefined
  // @ts-ignore
  if (fields.length === 1) return obj[fields[0]]
  // @ts-ignore
  if (fields.length === 2) return obj[fields[0]]?.[fields[1]]
  // @ts-ignore
  if (fields.length === 3) return obj[fields[0]]?.[fields[1]]?.[fields[2]]
  // @ts-ignore
  if (fields.length === 4) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]
  // @ts-ignore
  if (fields.length === 5) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]?.[fields[4]]
  // @ts-ignore
  if (fields.length === 6) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]?.[fields[4]]?.[fields[5]]
  // @ts-ignore
  if (fields.length === 7) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]?.[fields[4]]?.[fields[5]]?.[fields[6]]
  // @ts-ignore
  if (fields.length === 8) return obj[fields[0]]?.[fields[1]]?.[fields[2]]?.[fields[3]]?.[fields[4]]?.[fields[5]]?.[fields[6]]?.[fields[7]]
}
