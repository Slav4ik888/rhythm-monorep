import { isNum, isUndefined } from 'shared/lib/validators';


/**
 * Not text: '100%', 'auto', 'max-content', 'min-content'
 */
export const isPx = (value: number | string | undefined) => isNum(value) || isUndefined(value);
