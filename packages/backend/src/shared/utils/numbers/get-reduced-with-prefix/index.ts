import { isNotNum } from '../../../../libs/validators';



interface Result {
  value   : number | undefined
  prefix? : string
}

// Это метрические префиксы, обозначающие кратные единицы измерения.
export function getReducedWithPrefix(value?: number): Result {
  if (! value || isNotNum(value)) return { value };

  if      (value >= 1e12 || value <= -1e12) return { value: (value / 1e12), prefix: 'трлн' }; // триллионы
  else if (value >= 1e9  || value <= -1e9)  return { value: (value / 1e9),  prefix: 'млрд' }; // миллиарды
  else if (value >= 1e6  || value <= -1e6)  return { value: (value / 1e6),  prefix: 'млн' };  // миллионы
  else if (value >= 1e3  || value <= -1e3)  return { value: (value / 1e3),  prefix: 'тыс' };  // тысячи
  else return { value }; // если число меньше 1000
}

// Пример использования:
// console.log(getReducedWithPrefix(1234567));   // "1.2 млн"
// console.log(getReducedWithPrefix(1670000000)); // "1.6 млрд"
