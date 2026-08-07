/**
 * Запрашиваемые данные при регистрации аккаунта
 */
export interface SignupData {
  companyName?    : string

  firstName       : string // Имя
  secondName?     : string // Фамилия
  middleName?     : string // Отчество

  phoneNumber?    : string // Номер телефона

  email           : string
  password        : string
  confirmPassword : string

  partnerId       : string | null
  permissions     : boolean // Разрешения на обработку персональных данных
  isMobile        : boolean // С какого устройства вошёл
}

export interface SignupDataEnd {
  email     : string
  emailCode : string
}
