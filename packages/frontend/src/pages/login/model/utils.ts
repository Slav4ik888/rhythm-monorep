// packages/frontend/src/pages/login/model/utils.ts

/**
 * Возвращает куки с указанным name или undefined, если ничего не найдено
 */
export function getCookie(name: string): any {
  const matches = document.cookie.match(
    new RegExp(
      // eslint-disable-next-line no-useless-escape
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
