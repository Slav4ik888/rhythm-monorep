import { MOCK_EMAIL, MOCK_PASSWORD } from 'entities/base/mocks';
import { SignupData, SignupDataEnd } from '../types';


export const MOCK_SIGNUP_DATA_SMALL: SignupData = {
  firstName       : 'Slava',
  email           : MOCK_EMAIL,
  password        : MOCK_PASSWORD,
  confirmPassword : MOCK_PASSWORD,

  partnerId       : 'slava',
  permissions     : true,
  isMobile        : false
};


export const MOCK_SIGNUP_DATA_FULL: SignupData = {
  companyName     : 'Bobby Mayers',

  firstName       : 'Имя',
  secondName      : 'Фамилия',
  middleName      : 'Отчество',

  phoneNumber     : '+79501197888',

  email           : MOCK_EMAIL,
  password        : MOCK_PASSWORD,
  confirmPassword : MOCK_PASSWORD,

  partnerId       : 'slava',
  permissions     : true,
  isMobile        : false
};

export const MOCK_SIGNUP_DATA_END: SignupDataEnd = {
  email           : MOCK_EMAIL,
  emailCode       : '123456',
};
