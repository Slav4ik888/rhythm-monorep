import { ErrorObject } from 'ajv';
import { getItemByPos } from '../../../../../../../shared/utils/strings';


/**
 * Return last label | 'general'
 *  instancePath: '/courseAccess'
 */
export const getLabelByInstancePath = (err: ErrorObject): string =>
  getItemByPos(err?.instancePath, '/', 'last') || 'general';
