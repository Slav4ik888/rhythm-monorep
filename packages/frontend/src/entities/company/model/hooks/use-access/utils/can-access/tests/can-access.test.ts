import { canAccess } from '..';


describe('canAccess', () => {
  it('should allow when user has exact required access', () => {
    expect(canAccess('n', 'n')).toBe(true);
    expect(canAccess('v', 'v')).toBe(true);
    expect(canAccess('e', 'e')).toBe(true);
  });

  it('should allow when user has higher access than required', () => {
    expect(canAccess('e', 'v')).toBe(true);
    expect(canAccess('e', 'n')).toBe(true);
  });

  it('should deny when user has lower access than required', () => {
    expect(canAccess('v', 'e')).toBe(false);
    expect(canAccess('n', 'v')).toBe(false);
    expect(canAccess('n', 'e')).toBe(false);
  });

  it('should deny when user has no access (undefined)', () => {
    expect(canAccess(undefined, 'v')).toBe(false);
    expect(canAccess(undefined, 'e')).toBe(false);
    expect(canAccess(undefined, 'n')).toBe(false);
  });
});

// npm run test:unit can-access.test.ts
