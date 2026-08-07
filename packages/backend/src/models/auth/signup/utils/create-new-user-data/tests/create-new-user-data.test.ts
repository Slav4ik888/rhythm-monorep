import { createNewUserData, NewUser } from "..";
import { creatorFixDate } from '../../../../../base';
import { MOCK_EMAIL, MOCK_PASSWORD } from '../../../../../base/mocks';
import { Role, UserStatus } from '../../../../../user/types';
import { MOCK_SIGNUP_DATA_FULL, MOCK_SIGNUP_DATA_SMALL } from '../../../mocks';



describe('createNewUserData', () => {
  it('Valid required data, with Role.OWNER', () => {
    const newUser = createNewUserData(MOCK_SIGNUP_DATA_SMALL, Role.OWNER);
    newUser.createdAt  = creatorFixDate('', 0);
    newUser.lastChange = creatorFixDate('', 0);

    const resultUser: NewUser = {
      id        : '',
      companyId : '',

      person: {
        displayName : '',
        avatarUrl   : '',
        phoneNumber : '',
        fio: {
          firstName  : 'Slava',
          secondName : '',
          middleName : ''
        },
      },
      email           : MOCK_EMAIL,

      role            : Role.OWNER,

      emailVerified   : false,
      permissions     : true,
      status          : UserStatus.NEW,
      isEditAccess    : false,
      settings        : {},
      partner         : {
        partnerId  : '',
        referrerId : 'slava',
      },
      order           : 100,
      createdAt       : creatorFixDate('', 0),
      lastChange      : creatorFixDate('', 0),

      password        : MOCK_PASSWORD,
      confirmPassword : MOCK_PASSWORD,
      isMobile        : false
    };

    expect(newUser).toEqual(resultUser);
  });


  it('Valid required data, with Role.EMPLOYEE', () => {
    const newUser = createNewUserData(MOCK_SIGNUP_DATA_FULL);
    newUser.createdAt  = creatorFixDate('', 0);
    newUser.lastChange = creatorFixDate('', 0);

    const resultUser: NewUser = {
      id        : '',
      companyId : '',

      person: {
        displayName : '',
        avatarUrl   : '',
        phoneNumber : '+79501197888',
        fio: {
          firstName  : 'Имя',
          secondName : 'Фамилия',
          middleName : 'Отчество'
        },
      },
      email           : MOCK_EMAIL,
      role            : Role.EMPLOYEE,
      emailVerified   : false,
      permissions     : true,
      status          : UserStatus.NEW,

      isEditAccess    : false,
      settings        : {},
      partner: {
        partnerId  : '',
        referrerId : 'slava',
      },
      order           : 100,
      createdAt       : creatorFixDate('', 0),
      lastChange      : creatorFixDate('', 0),

      password        : MOCK_PASSWORD,
      confirmPassword : MOCK_PASSWORD,
      isMobile        : false
    };

    expect(newUser).toEqual(resultUser);
  });
});

// npm run test:unit create-new-user-data.test.ts
