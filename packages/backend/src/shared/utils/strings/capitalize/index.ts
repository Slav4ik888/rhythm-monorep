import { isNotStr } from '../../../../libs/validators';

interface CapitalConfig {
  first?: boolean
}

/**
 * v.2023-06-22
 * Returns
 */
export const capitalize = (
  str: string,
  cfg: CapitalConfig = {}
): string => {
  if (isNotStr(str)) return str

  const { first } = cfg;

  if (first) return str[0].toLocaleUpperCase() + str.slice(1)
  else return str.toLocaleUpperCase()
}
