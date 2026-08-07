import { ItemBase } from 'entities/base';

export enum PhoneNumberScheme {
  _122221 = '### (#) ##-##-##-##-#',
  _112222 = '### (#) # ##-##-##-##',

  _222222 = '### (##) ##-##-##-##',

  _3322   = '### (###) ###-##-##', // +71234567890 => +7 (123) 456-78-90
  _3331   = '### (###) ###-###-#',
  _3232   = '### (###) ##-###-##',
  _3223   = '### (###) ##-##-###',
  _32221  = '### (###) ##-##-##-#',
  _32131  = '### (###) ##-#-###-#',
  _32122  = '### (###) ##-#-##-##',
  _3133   = '### (###) #-###-###',
  _31321  = '### (###) #-###-##-#',
  _31312  = '### (###) #-###-#-##',
  _31222  = '### (###) #-##-##-##',
  _31231  = '### (###) #-##-###-#',
  _31213  = '### (###) #-##-#-###',
  _312121 = '### (###) #-##-#-##-#',
  _311221 = '### (###) #-#-##-##-#',
  _31123  = '### (###) #-#-##-###',

  _433    = '### (####) ###-###',
  _4321   = '### (####) ###-##-#',
  _4312   = '### (####) ###-#-##',
  _4231   = '### (####) ##-###-#',
  _4222   = '### (####) ##-##-##',
  _4213   = '### (####) ##-#-###',
  _42121  = '### (####) ##-#-##-#',
  _42112  = '### (####) ##-#-#-##',
  _4132   = '### (####) #-###-##',
  _4123   = '### (####) #-##-###',
  _41221  = '### (####) #-##-##-#',
  _41212  = '### (####) #-##-#-##'
}

/**
 * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 */
export enum CountryCode {
  RU = 'ru',
  US = 'us'
}


export enum PhoneType {
  FAX    = 'FAX',
  HOME   = 'HOME',
  WORK   = 'WORK',
  MOBILE = 'MOBILE'
}


/**
 * Номер телефона
 * @see https://github.com/catamphetamine/libphonenumber-js#phonenumber
 */
export interface PhoneNumber extends ItemBase {
  type               : PhoneType
  number             : string            // The phone number in E.164 format. Example: "+712345678".

  extension?         : string            // Ext field in '(213) 373-42-53 ext. 1234' => '1234'
  countryCallingCode : string            // The country calling code. Example: "7" - RU.
  countryCode?       : CountryCode       // Default 'RU'
  schema             : PhoneNumberScheme // Default '### (###) ###-##-##'. Exam.: +73952775985 => +7 (395) 277-59-85
}
