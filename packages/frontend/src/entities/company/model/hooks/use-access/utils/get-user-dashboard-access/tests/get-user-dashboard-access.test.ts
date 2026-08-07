import { ParamsCompany } from '../../../../../../types';
import { getUserDashboardAccess } from '..';



describe('getUserDashboardAccess', () => {
  const mockCompany = {
    dashboardMembers: [
      { e: 'user1@example.com', role: 'admin' },
      { e: 'user2@example.com', role: 'member' },
    ]
  } as unknown as ParamsCompany;

  it('should return user access when user is a member', () => {
    const result = getUserDashboardAccess(mockCompany, 'user1@example.com');
    expect(result).toEqual({ e: 'user1@example.com', role: 'admin' });
  });

  it('should return undefined when user is not a member', () => {
    const result = getUserDashboardAccess(mockCompany, 'nonexistent@example.com');
    expect(result).toBeUndefined();
  });

  it('should return undefined when company is undefined', () => {
    // @ts-ignore
    const result = getUserDashboardAccess(undefined, 'user1@example.com');
    expect(result).toBeUndefined();
  });

  it('should return undefined when company.members is undefined', () => {
    // @ts-ignore
    const result = getUserDashboardAccess({}, 'user1@example.com');
    expect(result).toBeUndefined();
  });

  it('should return undefined when company.members is empty', () => {
    // @ts-ignore
    const result = getUserDashboardAccess({ members: [] }, 'user1@example.com');
    expect(result).toBeUndefined();
  });

  it('should be case sensitive for email comparison', () => {
    const result = getUserDashboardAccess(mockCompany, 'USER1@example.com');
    expect(result).toBeUndefined();
  });

  it('should return the first matching member if email exists in multiple members', () => {
    const companyWithDuplicates = {
      dashboardMembers: [
        { e: 'user@example.com', role: 'admin' },
        { e: 'user@example.com', role: 'member' },
      ]
    } as unknown as ParamsCompany;
    const result = getUserDashboardAccess(companyWithDuplicates, 'user@example.com');
    expect(result).toEqual({ e: 'user@example.com', role: 'admin' });
  });
});

// npm run test:unit get-user-dashboard-access.test.ts
