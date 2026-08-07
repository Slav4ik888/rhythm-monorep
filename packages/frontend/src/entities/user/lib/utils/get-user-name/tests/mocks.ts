import { User } from '../../../../types';
import { Mocks } from './types';


export const mocks: Mocks = [
  [
    {
      description : 'Right User',
      user: {
        person: {
          fio: {
            firstName  : 'Slava',
            middleName : 'Alexandrovich',
            secondName : 'Korzan'
          }
        }
      } as User
    },
    'Slava Alexandrovich Korzan'
  ],
  [
    {
      description : 'User - firstName only',
      user: {
        person: {
          fio: {
            firstName: 'Slava'
          }
        }
      } as User
    },
    'Slava'
  ],
  [
    {
      description : 'User - secondName only',
      user: {
        person: {
          fio: {
            secondName: 'Korzan'
          }
        }
      } as User
    },
    'Korzan'
  ],
  [
    {
      description : 'User - middleName only',
      user: {
        person: {
          fio: {
            middleName: 'Alexandrovich'
          }
        }
      } as User
    },
    'Alexandrovich'
  ],
  [
    {
      description : 'User is empty',
      user: {} as User
    },
    ''
  ],
  [
    {
      description : 'person is undefined',
      user: {
        person: undefined
      } as unknown as User
    },
    ''
  ],
];
