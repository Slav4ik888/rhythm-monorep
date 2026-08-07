import { creatorFixDate } from 'entities/base';
import { cloneObj } from 'shared/helpers/objects';
import { isNotUndefined } from 'shared/lib/validators';
import { Role, User, UserStatus } from '../../../types';
import { creatorPerson } from '../creator-person';
import { creatorUserSettings } from '../creator-settings';



/** v.2025-10-17 */
export const creatorUser = (cfg: Partial<User> = {}): User => {
  const user: User = {
    id            : cfg.id            || '',
    companyId     : cfg.companyId     || '',

    person        : creatorPerson(cfg.person),
    email         : cfg.email         || '',

    role          : cfg.role          || Role.EMPLOYEE,

    emailVerified : cfg.emailVerified || false,
    permissions   : cfg.permissions   || false, // Разрешения на обработку персональных данных
    status        : cfg.status        || UserStatus.NEW,
    order         : cfg.order         || 100,

    settings      : cfg.settings      || creatorUserSettings(),
    partner       : cfg.partner       || {
                                            partnerId  : '',
                                            referrerId : '',
                                          },

    isEditAccess  : cfg.isEditAccess  || false,
    createdAt     : cfg.createdAt     || creatorFixDate(cfg.id),
    lastChange    : cfg.lastChange    || creatorFixDate(cfg.id)
  };

  if (isNotUndefined(cfg.condition))   user.condition   = cfg.condition;
  if (isNotUndefined(cfg.label))       user.label       = cfg.label;
  if (isNotUndefined(cfg.description)) user.description = cfg.description;
  if (isNotUndefined(cfg.comment))     user.comment     = cfg.comment;

  return cloneObj(user)
};
