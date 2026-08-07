import { Person } from '../../types';
import { MOCK_FIO, MOCK_FIO_EMPTY } from './fio';


export const MOCK_PERSON_EMPTY: Person = {
  displayName : '',
  avatarUrl   : '',
  phoneNumber : '',
  fio         : MOCK_FIO_EMPTY,
  // phones      : []
};

export const MOCK_PERSON: Person = {
  displayName : 'Slava Korzan',
  /* eslint-disable-next-line max-len */
  avatarUrl   : 'https://firebasestorage.googleapis.com/v0/b/osnova-course.appspot.com/o/no-img-user.svg?alt=media&token=b323e291-7719-446a-93bf-09b6593b9927',
  phoneNumber : '+79501197888',
  fio         : MOCK_FIO,
  // phones      : []
};
