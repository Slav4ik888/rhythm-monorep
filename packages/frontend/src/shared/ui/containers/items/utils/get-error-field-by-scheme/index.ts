
const getCamelCase = (text: string) => text[0].toUpperCase() + text.slice(1);

/**
 * Чтобы не передавать название поля с ошибкой для элемента,
 * мы берём его из названия схемы
 */
export const getErrorFieldByScheme = (scheme: string) => {
  if (!scheme) return '';

  const splited = scheme.split('.');

  if (splited.length === 1) return scheme;

  let result = splited[0];

  splited.forEach((item, idx) => {
    if (idx > 0) {
      result += getCamelCase(item);
    }
  });

  return result
}
