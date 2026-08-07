import { AccessLevel } from './base';


/** Права к профилю компании */
export interface CompanyProfileAccess {
  f? : AccessLevel // full Изначально только владелец
  // aU? : boolean     // addUsers
  // anyFields: AccessLevel
}

/** Участник с правами к профилю компании */
export interface CompanyProfileMember {
  e : string // email
  a : CompanyProfileAccess
}
