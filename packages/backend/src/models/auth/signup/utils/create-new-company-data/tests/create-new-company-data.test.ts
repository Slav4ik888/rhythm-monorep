import { createNewCompanyData, CreateNewCompany } from '..';
import { creatorFixDate } from '../../../../../base';
import { Company, CompanyStatus } from '../../../../../company';


describe('createNewCompanyData', () => {
  it('companyName is empty', () => {
    const newCompany = createNewCompanyData({ email: 'korzan.va@mail.ru' });
    newCompany.createdAt  = creatorFixDate('', 0);
    newCompany.lastChange = creatorFixDate('', 0);

    const resultCompany: Company = {
      id                    : '',
      ownerId               : '',
      companyName           : '',
      owner                 : 'korzan.va@mail.ru',
      logoUrl               : '',
      googleData            : { url: '' },
      status                : CompanyStatus.NEW,
      customSettings        : {},
      dashboardMembers      : [],
      companyMembers        : [],
      bunchesUpdated        : {},
      dashboardPublicAccess : {},
      sheets                : {},
      createdAt             : creatorFixDate('', 0),
      lastChange            : creatorFixDate('', 0)
    };

    expect(newCompany).toEqual(resultCompany);
  });


  it('companyName is "Bobby Mayers"', () => {
    const newCompany = createNewCompanyData({ companyName: 'Bobby Mayers', email: 'korzan.va@mail.ru' });
    newCompany.createdAt  = creatorFixDate('', 0);
    newCompany.lastChange = creatorFixDate('', 0);

    const resultCompany: Company = {
      id                    : '',
      ownerId               : '',
      companyName           : 'Bobby Mayers',
      owner                 : 'korzan.va@mail.ru',
      logoUrl               : '',
      googleData            : { url: '' },
      status                : CompanyStatus.NEW,
      customSettings        : {},
      dashboardMembers      : [],
      companyMembers        : [],
      bunchesUpdated        : {},
      dashboardPublicAccess : {},
      sheets                : {},
      createdAt             : creatorFixDate('', 0),
      lastChange            : creatorFixDate('', 0)
    };

    expect(newCompany).toEqual(resultCompany);
  });

  it('undefined', () => {
    const newCompany = createNewCompanyData({} as CreateNewCompany);
    newCompany.createdAt  = creatorFixDate('', 0);
    newCompany.lastChange = creatorFixDate('', 0);

    const resultCompany: Company = {
      id                    : '',
      ownerId               : '',
      companyName           : '',
      owner                 : '',
      logoUrl               : '',
      googleData            : { url: '' },
      status                : CompanyStatus.NEW,
      customSettings        : {},
      dashboardMembers      : [],
      companyMembers        : [],
      bunchesUpdated        : {},
      dashboardPublicAccess : {},
      sheets                : {},
      createdAt             : creatorFixDate('', 0),
      lastChange            : creatorFixDate('', 0)
    };

    expect(newCompany).toEqual(resultCompany);
  });
});

// npm run test:unit create-new-company-data.test.ts
