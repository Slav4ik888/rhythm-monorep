import { Company } from '../../../../../types';
import { SCHEMA_NAME, validate } from 'shared/lib/validators';
import { MOCK_COMPANY } from '../../../../../lib/mocks';
import { creatorCompany, creatorSheet } from '../../../../../lib/creators';
import { MOCK_DATE_13_03_2023 } from 'entities/base/mocks';
import { MOCK_USER_ID } from 'entities/user/lib/mocks';
import { getMockStrLength } from 'shared/helpers/strings';



describe(`Validate scheme - ${SCHEMA_NAME.COMPANY}`, () => {
  test('should validate company schema', () => {
    const companyData: Company = creatorCompany({
      ...MOCK_COMPANY,
      owner          : 'demo@mail.com',
      // partnerCode    : 'code1',
      companyMembers : [{
        e : 'user1@mail.com',
        a : {
          f: 'e'
        }
      }, {
        e : 'user2@mail.com',
        a : {
          f: 'n'
        }
      }],
      googleData     : { url: 'https://google.com' },
      customSettings : {
        periodType: {
          'week': {
            title      : 'Period week',
            color      : '#123123',
            background : '#fff',
          },
          'month': {
            title      : 'Period month',
            color      : '#238d5dff',
            background : '#603333ff',
          },
        },
        companyType : {},
        productType : {},
      },

      bunchesUpdated: {
        '123': MOCK_DATE_13_03_2023,
        '124': MOCK_DATE_13_03_2023,
      },

      sheets: {
        '1_sheet': creatorSheet({
          id     : '1_sheet',
          userId : MOCK_USER_ID,
          title  : 'Sheet 1',
          iconId : 'equalizer',
          route  : '',
          order  : 1
        }),
        '2_sheet': creatorSheet({
          id     : '2_sheet',
          userId : MOCK_USER_ID,
          title  : 'Sheet 2',
          iconId : 'equalizer',
          route  : '',
          order  : 1
        }),
      },

      dashboardMembers: [{
        e : 'user1@mail.com',
        a : {
          f: 'e'
        }
      }, {
        e : 'user2@mail.com',
        a : {
          f: 'n'
        }
      }],

      dashboardPublicAccess: {
        '123': true,
        '345': false
      }
    });

    expect(validate(SCHEMA_NAME.COMPANY, companyData)).toEqual({
      errors: {}, valid: true
    })
  });

  test('should invalid fields of company date', () => {
    const dm = {
      e: 'user1@mail.com',
      a: {
        f: 'e'
      }
    };

    const companyData: Company = {
      ...creatorCompany({
        ...MOCK_COMPANY,
        owner          : 'demo@mail',
        // partnerCode    : '123456',
        companyMembers : [{
          e : 'user1@mail',
          // @ts-ignore
          b : '',
        }],
        // @ts-ignore
        googleData     : {},
        customSettings : {
          periodType: {
            'week': {
              title      : 'Period week',
              // @ts-ignore
              color      : {},
              any        : {},
            },
          },
          // @ts-ignore
          companyType : [],
        },
        bunchesUpdated: {
          '124': 167866560000012,
          // @ts-ignore
          '125': '123',
        },
        sheets: {
          '1_sheet': {
            ...creatorSheet({
              // @ts-ignore
              id     : {},
              userId : getMockStrLength(31),
              title  : 'Sheet 1',
              iconId : 'equalizer',
              route  : '',
              order  : 1
            }),
            // @ts-ignore
            type   : 'any',
            // @ts-ignore
            addySheetField: {}
          },
        },
        dashboardMembers: [
          // @ts-ignore
          dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm,
          // @ts-ignore
          dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm, dm,
        ],
        // @ts-ignore
        dashboardPublicAccess: [{ '123': true }, { '345': false }]
      }),
      // @ts-ignore
      addyField: {}
    };

    // console.log('companyData: ', companyData);


    expect(validate(SCHEMA_NAME.COMPANY, companyData)).toEqual({
      valid: false,
      errors: {
        'owner'                 : 'Не верный формат данных, для поля "owner".',
        // 'partnerCode'           : 'Поле "partnerCode" не должно быть больше 5 символов.',
        'url'                   : 'Отсутствует обязательное поле "url".',
        'companyType'           : 'Не верный формат данных, для поля "companyType".',
        'any'                   : 'Присутствует недопустимое поле "any".',
        'color'                 : 'Не верный формат данных, для поля "color".',
        'e'                     : 'Не верный формат данных, для поля "e".',
        // 'e'                    : 'Отсутствует обязательное поле "e".',
        'a'                     : 'Отсутствует обязательное поле "a".',
        'b'                     : 'Присутствует недопустимое поле "b".',
        'addyField'             : 'Присутствует недопустимое поле "addyField".',
        '124'                   : 'Поле "124" не должно быть больше 4102423200000.',
        '125'                   : 'Не верный формат данных, для поля "125".',
        'addySheetField'        : 'Присутствует недопустимое поле "addySheetField".',
        'general'               : 'must be equal to one of the allowed values', // invalid sheet type
        'id'                    : 'Не верный формат данных, для поля "id".',
        'userId'                : 'Поле "userId" не должно быть больше 28 символов.',
        'dashboardMembers'      : 'Массив "dashboardMembers" не должен быть больше 30 элементов.',
        'dashboardPublicAccess' : 'Не верный формат данных, для поля "dashboardPublicAccess".',
      }
    });
  });
});

// npm run test:unit validate-company-schema.test.ts
