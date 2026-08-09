// packages/frontend/src/entities/user/index.ts

export type { User, PartialUser } from './types';
export { useUser } from './model/hooks';

export { useUserStore } from './model/store';
export type { StateSchemaUser } from './model/slice/state-schema';
export type { ReqGetAuth } from './model/services';
export { getAuth } from './model/services';

// Для обратной совместимости: ре-экспорт actionsUser и reducerUser
export { actions as actionsUser, reducer as reducerUser } from './model/slice';

export { selectUserId } from './model/selectors';
export { schemas, validateUserData } from './model/validators';
export { creatorUser } from './lib/creators';
