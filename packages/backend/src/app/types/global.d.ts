import { Context as KoaContext } from 'koa';
import { SignupData, AuthByLogin } from '../../models';
import { SignupDataEnd } from '../../models/auth';
import { Company } from '../../models/company';
import { User } from '../../models/user';



type Context = KoaContext & {
  request: {
    body?: {
      companyId?       : string
      email?           : string
      signupData?      : SignupData
      signupDataEnd?   : SignupDataEnd
      authByLogin?     : AuthByLogin
      userData?        : Partial<User>
      companyData?     : Partial<Company>
    }
  },
  state: {
    user?      : User
    callback?  : boolean
  }
}

type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T
}
