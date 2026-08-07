import { isNotUndefined } from 'shared/lib/validators';


/**
 * Возвращает true если данные не пустая строка '' и не undefined
 */
export const is = (data: any): boolean => isNotUndefined(data) && data !== '';
