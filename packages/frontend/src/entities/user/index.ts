export type { User, PartialUser } from './types'
export { useUser } from './model/hooks'

export {
  actions as actionsUser,
  reducer as reducerUser
} from './model/slice'
export { StateSchemaUser } from './model/slice/state-schema'
export { ReqGetAuth, getAuth } from './model/services'

export { selectUserId } from './model/selectors'
export { schemas, validateUserData } from './model/validators'
export { creatorUser } from './lib/creators'
