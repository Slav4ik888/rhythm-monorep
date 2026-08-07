import { isUndefined } from '../../../../libs/validators';


/** Возвращает число после запятой */ 
export const getRest = (value: number | undefined): number | undefined => {
  if (isUndefined(value) || ! value && value !== 0) return undefined;

  let num = String(value); // преобразуем число в строку
  return +num.split('.')[1] || 0; // получаем вторую часть строки после десятичной точки
}
