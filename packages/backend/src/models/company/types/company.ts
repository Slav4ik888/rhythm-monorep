import { BunchesUpdated } from '../../../shared/lib/structures/bunch';
import { FixDate } from '../../base';
import { CompanyDashboardMember, CompanyProfileMember } from './access';
import { DashboardSheets } from './sheets';



export enum CompanyStatus {
  NEW      = 'NEW',    // 'Зарегистрирован'
  VERIFIED = 'VERIFIED',
  ACTIVE   = 'ACTIVE', // 'Активный'
  REMOVED  = 'REMOVED' // 'Удалён'
}


export interface GoogleData {
  url: string
}


/** Для сохранения уникальных настроек переменных (цветов и констант) */
export type ColorSettingsType = 'color' | 'background'

export interface ColorSettings {
  title?      : string // Можно исп для periodType, напр. "Мес" | "Нед"
  color?      : string
  background? : string
}

export interface CustomSettings {
  // [key: string]: ColorSettings
  periodType?  : Record<string, ColorSettings>
  companyType? : Record<string, ColorSettings>
  productType? : Record<string, ColorSettings>
}


export type CompanyId = string

/**
 * v.2025-10-11
 * Профиль компании
 */
export interface Company {
  id                     : CompanyId
  companyName            : string
  ownerId                : string
  owner                  : string // email

  logoUrl                : string // https://firebasestorage.googleapis.com/v0/b/osnova-course.appspot.com/o/no-img-company.svg?alt=media
  status                 : CompanyStatus
  // partnerCode?           : string // Код партнера
  companyMembers         : CompanyProfileMember[]
  createdAt              : FixDate
  lastChange             : FixDate

  // DASHBOARD`s
  googleData             : GoogleData
  customSettings         : CustomSettings
  bunchesUpdated         : BunchesUpdated          // При любом изменении ViewItems - происходит обновление
  sheets?                : DashboardSheets         // Вкладки помимо основной
  dashboardMembers       : CompanyDashboardMember[]
  dashboardPublicAccess? : Record<string, boolean> // Настройки публичного доступа для страниц <dashboardPageId, boolean> main - по умолчанию
}

export type PartialCompany = Partial<Company> & { id: string }

/** Обязательные поля для чужого пользователя прошедшего по ссылке */
export type ParamsCompany = PartialCompany & {
  customSettings         : CustomSettings
  googleData             : GoogleData
  bunchesUpdated         : BunchesUpdated
  dashboardMembers       : CompanyDashboardMember[]
  dashboardPublicAccess? : Record<string, boolean>
  companyMembers         : CompanyProfileMember[]
}
