// import { PhoneNumber } from './phones';

export interface FIO {
  firstName  : string // Имя
  secondName : string // Фамилия
  middleName : string // Отчество
}

export interface Person {
  displayName   : string  // Имя которое будет выводиться в бэйджиках
  avatarUrl     : string
  phoneNumber   : string // '+15555550003' Номер телефона (на который производилась регистрация)
  fio           : FIO
  // phones        : PhoneNumber[]
}
