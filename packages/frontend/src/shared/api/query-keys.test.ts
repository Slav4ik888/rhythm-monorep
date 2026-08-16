import { queryKeys } from './query-keys';

describe('queryKeys', () => {
  it('auth.getAuth', () => {
    expect(queryKeys.auth.getAuth).toEqual(['auth']);
  });

  it('company.params формирует ключ с companyId и dashboardSheetId', () => {
    expect(queryKeys.company.params('company-1', 'sheet-1')).toEqual(['company', 'params', 'company-1', 'sheet-1']);
  });

  it('dashboard.bunches разворачивает bunchIds в ключ', () => {
    expect(queryKeys.dashboard.bunches('company-1', ['bunch-1', 'bunch-2'])).toEqual([
      'dashboard',
      'bunches',
      'company-1',
      'bunch-1',
      'bunch-2',
    ]);
  });

  it('dashboard.bunches без bunchIds', () => {
    expect(queryKeys.dashboard.bunches('company-1', [])).toEqual(['dashboard', 'bunches', 'company-1']);
  });

  it('dashboard.data формирует ключ с companyId и dashboardSheetId', () => {
    expect(queryKeys.dashboard.data('company-1', 'sheet-1')).toEqual(['dashboard', 'data', 'company-1', 'sheet-1']);
  });
});
