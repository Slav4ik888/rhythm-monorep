import { Context } from '../../../app/types/global';
import { isStr } from '../../validators';
import { getUserDataTemp } from '../get-user-data-temp';

/**
 * Create log template
 * exm:
 *  [f]: <functionName> [u]: <userId> [e]: <email> [v]: <value>
 *  [f]: <functionName> [u]: lnmqB8rgzNYFSRZ7STmE8U6YBlt2 [e]: korzan.va@mail.ru [v]: 123
 */
export const createLogTemp = (
  ctx          : Context,
  functionName : string,
  value?       : string
): string => {

  let res = `[f]: ${functionName} ${getUserDataTemp(ctx)}`;

  if (value) res += ` [v]: ${value}`

  return res
};
