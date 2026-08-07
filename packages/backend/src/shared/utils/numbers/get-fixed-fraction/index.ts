import { isNotNum } from '../../../../libs/validators';
import { addZeroToRest } from '../add-zero-to-rest';



export interface Config {
  fractionDigits? : number
  addZero?        : boolean // добавляет нули в конце
}


/** Возвращает число с обрезанными десятичными, по заданную длину */
export const getFixedFraction = (
  value  : number | undefined,
  config : Config = {}
): string => {
  if (! value && value !== 0 || isNotNum(value)) return '';


  const result = +value.toFixed(config.fractionDigits || 0);

  return config.addZero
    ? addZeroToRest(result, config.fractionDigits)
    : String(result)
}
