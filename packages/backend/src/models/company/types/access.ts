/** Уровни доступа */
export type AccessLevel = 'n' | 'v' | 'e' // 'none' | 'view' | 'edit'

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


/** Права к дашборду компании  */
export interface CompanyDashboardAccess {
  f: AccessLevel // full
  // aU: boolean     // addUsers
  // anyFields: AccessLevel
}

/** Участник с правами к дашборду компании */
export interface CompanyDashboardMember {
  e : string // email
  a : CompanyDashboardAccess
}


// export type CompanyDashboardAccessScheme = 'a.f'

export enum CompanyDashboardAccessScheme {
  AF = 'a.f'
}


// Пользователь написал email кому хочет дать доступ
// Валидируем email
// Проверяем есть ли этот пользователь в базе (получаем его UserId)
//  - Есть - создаём CompanyMember и наполняем правами
//  - Нет - создаём User, получаем обратно его UserId
