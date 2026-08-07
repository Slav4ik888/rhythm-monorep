
/**
 * Проверки строки на соответствие формату цвета RGBA в виде #RRGGBBAA,
 * где RR, GG, BB, AA - шестнадцатеричные значения компонентов цвета и прозрачности
 */
export function isValidRGBA(colorStr: string): boolean {
  // Проверяем, что строка начинается с # и имеет длину 5 или 9 символов (# + 4 или + 8 символов)
  return /^#([0-9A-Fa-f]{8}|[0-9A-Fa-f]{4})$/.test(colorStr);
}

// Пример использования
// console.log(isValidRGBA('#FF001185'));  // true
// console.log(isValidRGBA('#F018'));      // true (короткая запись)
// console.log(isValidRGBA('#ff001185'));  // true (регистр не важен)
// console.log(isValidRGBA('#GG001185'));  // false (недопустимые символы)
// console.log(isValidRGBA('#FF00118'));   // false (не хватает символов)
// console.log(isValidRGBA('#FF0011855')); // false (слишком много символов)
// console.log(isValidRGBA('FF001185'));   // false (нет # в начале)
