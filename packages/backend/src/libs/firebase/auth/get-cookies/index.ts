import { Context } from 'koa';

/** Get all cookies from header */
export function getCookies(ctx: Context): object {
  const cookieHeader = ctx.headers.cookie;

  const cookie = {};

  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    cookies.forEach(function (item) {
      const crumbs = item.split('=');
      if (crumbs.length > 1) cookie[crumbs[0].trim()] = crumbs[1].trim();
    });
  }
  return cookie
}
