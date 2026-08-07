import { Context } from 'koa';
import { Logger } from 'winston';
import { Errors } from '../../../libs/validators';
import { getErrors } from '../get-errors';
import { getStatus } from '../get-status';



export type ErrorFunction = (errors: Errors) => void


/**
 * Log errors & throw error to client
 * @param {ctx} ctx 
 * @param {string} logTemp 
 * @param {object} errors 
 * @param {function} logger 
 * 
 * @returns {Function}
 */
export const responseError = (
  ctx     : Context,
  logger  : Logger,
  logTemp : string
): ErrorFunction => (
  err     : Errors
): void => {
  console.log('[ResponseError] ОШИБКА');
  console.log(err);

  // if (errors.errorInfo) message = errors.errorInfo as unknown as Errors;
  const errors = getErrors(err);
  console.log('[ResponseError] errors: ', errors);
  console.log('getStatus: ', getStatus(err));

  ctx.status = getStatus(err);
  ctx.body   = errors;
  logger.error(`${logTemp} - ${JSON.stringify(errors.unknownError ? err : errors)}`);
  // TODO: sendMail to me
};
