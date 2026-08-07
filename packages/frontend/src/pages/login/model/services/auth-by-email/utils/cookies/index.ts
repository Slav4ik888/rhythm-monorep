export interface Options {
  path?      : string;
  expires?   : string | number | Date;
  'max-age'? : number;
}


/**
 * Возвращает куки с указанным name или undefined, если ничего не найдено
 */
export function getCookie(name: string): any {
  const matches = document.cookie.match(new RegExp(
    // eslint-disable-next-line no-useless-escape
    `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


// export function setCookie(name: string, value: string, options: Options = {}): void {

//   options = {
//     path: '/',
//     // при необходимости добавьте другие значения по умолчанию
//     ...options
//   };

//   if (options.expires instanceof Date) {
//     options.expires = options.expires.toUTCString();
//   }

//   let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

//   for (let optionKey in options) {
//     updatedCookie += "; " + optionKey;
//     let optionValue = options[optionKey];
//     if (optionValue !== true) {
//       updatedCookie += "=" + optionValue;
//     }
//   }

//   document.cookie = updatedCookie;
// }

// // Пример использования:
// // setCookie('user', 'John', {secure: true, 'max-age': 3600});
// export function deleteCookie(name: string): void {
//   setCookie(name, "", {
//     'max-age': -1
//   })
// }
