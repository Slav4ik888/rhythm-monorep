
/**
 *
 * @param rgba - "rgba(100, 154, 163, 1)"
 * @returns
 */
export function rgbaToHexWithAlpha(rgba: string) {
  // Удаляем "rgba(" и ")" из строки, затем разбиваем на компоненты
  const parts = rgba.substring(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');

  // Извлекаем R, G, B, A (удаляем пробелы, преобразуем в числа)
  const r = parseInt(parts[0] ? parts[0].trim() : '0', 10);
  const g = parseInt(parts[1] ? parts[1].trim() : '0', 10);
  const b = parseInt(parts[2] ? parts[2].trim() : '0', 10);
  let a = parseFloat(parts[3] ? parts[3].trim() : '1'); // Если альфа не указана, используем 1

  // Преобразуем альфа-канал из [0, 1] в [0, 255] и округляем
  a = Math.round(a * 255);

  // Преобразуем каждый компонент в 2-значный HEX
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  // Собираем HEX-строку
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

// Пример использования
// console.log(rgbaToHexWithAlpha('rgba(255, 100, 50, 0.5)')); // Выведет "#ff64327f"
// console.log(rgbaToHexWithAlpha('rgba(0, 0, 255, 1)'));      // Выведет "#0000ffff"
