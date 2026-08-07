import { isStr } from 'shared/lib/validators';


/** Returns  */
export const getDimension = (defaultValue: number | string | undefined): string => isStr(defaultValue)
  ? defaultValue !== ''
    ? defaultValue as string // Если строка и она не пуста
    : '-'
  : 'in px';
