
/** Адрес */
export interface Address {
  postCode?      : number // Почтовый индекс
  country        : string // Страна
  regin?         : string // Область
  city?          : string // Город
  locality?      : string // Населенный пункт
  street?        : string // Улица
  houseNumber    : string // Номер дома
  buildingNumber : string // Номер строения
  flatNumber     : string // Номер квартиры
  officeNumber   : string // Номер офиса
  comment?       : string
}
