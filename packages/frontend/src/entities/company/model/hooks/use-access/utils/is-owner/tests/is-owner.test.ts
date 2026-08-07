import { isOwner } from '..';
import { ParamsCompany } from '../../../../../../types';



describe('isOwner', () => {
  it('should return true when user is the owner', () => {
    const company = { owner: 'owner@example.com' } as ParamsCompany;
    const userEmail = 'owner@example.com';

    expect(isOwner(company, userEmail)).toBe(true);
  });

  it('should return false when user is not the owner', () => {
    const company = { owner: 'owner@example.com' } as ParamsCompany;
    const userEmail = 'other@example.com';

    expect(isOwner(company, userEmail)).toBe(false);
  });

  it('should return false when company is undefined', () => {
    const company = undefined;
    const userEmail = 'owner@example.com';

    // @ts-ignore
    expect(isOwner(company, userEmail)).toBe(false);
  });

  it('should return false when company owner is undefined', () => {
    const company = { owner: undefined };
    const userEmail = 'owner@example.com';

    // @ts-ignore
    expect(isOwner(company, userEmail)).toBe(false);
  });

  it('should return false when userEmail is undefined', () => {
    const company = { owner: 'owner@example.com' } as ParamsCompany;
    const userEmail = undefined;

    // @ts-ignore
    expect(isOwner(company, userEmail)).toBe(false);
  });

  it('should be case sensitive for email comparison', () => {
    const company = { owner: 'Owner@Example.com' } as ParamsCompany;
    const userEmail = 'owner@example.com';

    expect(isOwner(company, userEmail)).toBe(false);
  });
});

// npm run test:unit is-owner.test.ts
