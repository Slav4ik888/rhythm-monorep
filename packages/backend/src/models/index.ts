import * as auth from './auth'
import * as base from './base'
import * as company from './company'
import * as paramsCompany from './params-company'
import * as user from './user'
import * as dashboard from './dashboard-view'
import * as docs from './docs'
import * as google from './google'
import * as logs from './loggers'
import * as templates from './templates'
import * as partner from './partner'

export { SignupData, AuthByLogin } from './auth'
export { creatorCompany, MOCK_OWNER_ID, MOCK_COMPANY_ID } from './company'


export default {
  auth,
  base,
  company,
  user,
  dashboard,
  templates,
  paramsCompany,
  docs,
  google,
  logs,
  partner
}
