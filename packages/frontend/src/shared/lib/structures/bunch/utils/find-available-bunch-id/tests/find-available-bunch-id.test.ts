import { findAvailableBunchId } from '..';


describe('findAvailableBunchId', () => {
  test('should return undefined for empty array', () => {
    expect(findAvailableBunchId([], 100)).toBeUndefined();
  });

  test('should return bunchId when count < 100', () => {
    const items = Array(99).fill(0).map((_, i) => ({
      id: `item-${i}`,
      bunchId: 'bunch1'
    }));

    expect(findAvailableBunchId(items, 100)).toBe('bunch1');
  });

  test('should return undefined when all bunches are full', () => {
    const items = Array(100).fill(0).map((_, i) => ({
      id: `item-${i}`,
      bunchId: 'bunch1'
    }));

    expect(findAvailableBunchId(items, 100)).toBeUndefined();
  });

  test('should return first available bunchId', () => {
    const items = [
      ...Array(100).fill(0).map((_, i) => ({
        id: `item-${i}`,
        bunchId: 'full-bunch'
      })),
      ...Array(50).fill(0).map((_, i) => ({
        id: `item-${100 + i}`,
        bunchId: 'available-bunch'
      }))
    ];

    expect(findAvailableBunchId(items, 100)).toBe('available-bunch');
  });

  test('should work with multiple bunches', () => {
    const items = [
      ...Array(100).fill(0).map((_, i) => ({
        id: `item-${i}`,
        bunchId: 'bunch1'
      })),
      ...Array(99).fill(0).map((_, i) => ({
        id: `item-${100 + i}`,
        bunchId: 'bunch2'
      })),
      ...Array(100).fill(0).map((_, i) => ({
        id: `item-${199 + i}`,
        bunchId: 'bunch3'
      }))
    ];

    expect(findAvailableBunchId(items, 100)).toBe('bunch2');
  });

  // freeCount
  test('should return bunchId when count < 100, but freeCount is present', () => {
    const items = Array(95).fill(0).map((_, i) => ({
      id: `item-${i}`,
      bunchId: 'bunch1'
    }));

    expect(findAvailableBunchId(items, 100, 5)).toBe('bunch1');
  });
  test('should return undefined when all bunches not full, but freeCount is present', () => {
    const items = Array(96).fill(0).map((_, i) => ({
      id: `item-${i}`,
      bunchId: 'bunch1'
    }));

    expect(findAvailableBunchId(items, 100, 5)).toBeUndefined();
  });
});


// npm run test:unit find-available-bunch-id.test.ts
