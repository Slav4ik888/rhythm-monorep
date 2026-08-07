import { Context } from '../../../../app/types/global';
import { ERR_CODE, getErrorMessage } from '../../../../views';



export function checkCsrfToken(ctx: Context): void {
  const
    bodyCsrfToken = (ctx.request.body as Context).csrfToken,
    csrfToken = bodyCsrfToken ? bodyCsrfToken?.toString() : '';

  // Guard against CSRF attacks.
  if (ctx.cookies && csrfToken) {
    // @ts-ignore
    if (csrfToken !== (ctx as Context).cookies.csrfToken) {
      ctx.throw(401, { general: getErrorMessage(ERR_CODE.GuardCSRF) });
    }
  }
}
