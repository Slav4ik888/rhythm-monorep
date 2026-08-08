export type { User, PartialUser } from './types'
export { useUser } from './model/hooks'

export {
  actions as actionsUser,
  reducer as reducerUser
} from './model/slice'
export type { StateSchemaUser } from './model/slice/state-schema'
export type { ReqGetAuth } from "./model/services";
export { getAuth } from "./model/services";

export { selectUserId } from './model/selectors'
export { schemas, validateUserData } from './model/validators'
export { creatorUser } from './lib/creators'
