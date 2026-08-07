import { FIO } from '../../types';


/** v.2023-09-22 */
export const creatorFIO = (cfg: Partial<FIO> = {}): FIO => ({
  firstName  : cfg.firstName  || '',
  secondName : cfg.secondName || '',
  middleName : cfg.middleName || ''
});
