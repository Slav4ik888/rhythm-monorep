// packages/backend/src/models/company/utils/tests/to-params-company.test.ts

import { MOCK_COMPANY } from '../../mocks';
import { toParamsCompany } from '../to-params-company';

describe('toParamsCompany', () => {
  it('убирает ownerId и служебные таймстампы', () => {
    const result = toParamsCompany(MOCK_COMPANY);

    expect(result).not.toHaveProperty('ownerId');
    expect(result).not.toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('lastChange');
    expect(result.id).toBe(MOCK_COMPANY.id);
    expect(result.companyName).toBe(MOCK_COMPANY.companyName);
    expect(result.dashboardMembers).toEqual(MOCK_COMPANY.dashboardMembers);
    expect(result.customSettings).toEqual(MOCK_COMPANY.customSettings);
  });
});
