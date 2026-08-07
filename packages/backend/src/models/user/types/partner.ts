
/** Инфо по партнёрским делам в профиль пользователя */
export interface UserPartnerData {
  partnerId  : string // Его ID как партнёра, если зарегистрирован у нас
  referrerId : string // Кто привел этого пользователя. ID партнёра по реферальной ссылке которого пользователь пришёл
}

// http://localhost:3000/demo/?ref=5994014
