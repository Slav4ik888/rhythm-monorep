import { MOCK_COMPANY_EMPTY } from '../../../mocks';
import { cloneObj } from 'shared/helpers/objects';
import { creatorCompany } from '..';
import { Company } from '../../../../types';



const COMPANY_WITHOUT_ANY_FIELDS = {
  id              : MOCK_COMPANY_EMPTY.id,
  ownerId         : MOCK_COMPANY_EMPTY.ownerId,
  additionalField : 'some'
};


describe('creatorCompany', () => {
  test('Company without any fields & has additional', () => {
    const res = creatorCompany(COMPANY_WITHOUT_ANY_FIELDS as unknown as Company);
    res.bunchesUpdated   = MOCK_COMPANY_EMPTY.bunchesUpdated;
    res.createdAt        = MOCK_COMPANY_EMPTY.createdAt;
    res.lastChange       = MOCK_COMPANY_EMPTY.lastChange;

    expect(res).toEqual(MOCK_COMPANY_EMPTY);
  });

  test('With Company data', () => {
    expect(creatorCompany(MOCK_COMPANY_EMPTY)).toEqual(MOCK_COMPANY_EMPTY);
  });

  test('Company is undefined', () => {
    const
      res = creatorCompany(undefined),
      company = cloneObj(MOCK_COMPANY_EMPTY);

    company.id                = '';
    company.ownerId           = '';
    company.createdAt.userId  = '';
    company.createdAt.date    = 0;
    company.lastChange.userId = '';
    company.lastChange.date   = 0;

    res.createdAt.date   = 0;
    res.lastChange.date  = 0;


    expect(res).toEqual(company);
  });
});


// npm run test:unit creator-company.test.ts
