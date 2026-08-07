import { BunchesViewItem, ViewItem } from '../../../../types';
import { getBunchesWithoutChanges } from '..';



describe('getBunchesWithoutChanges', () => {
  // Mock данные для тестов
  const mockLocalBunches: BunchesViewItem = {
    bunch1: {
      item1: { id: 'item1', name: 'Item 1' } as unknown as ViewItem,
      item2: { id: 'item2', name: 'Item 2' } as unknown as ViewItem,
    },
    bunch2: {
      item3: { id: 'item3', name: 'Item 3' } as unknown as ViewItem,
    },
    bunch3: {
      item4: { id: 'item4', name: 'Item 4' } as unknown as ViewItem,
    },
  };

  it('should return all bunches when changedBunches is empty', () => {
    const changedBunches: string[] = [];
    const result = getBunchesWithoutChanges(changedBunches, mockLocalBunches);
    expect(result).toEqual(mockLocalBunches);
  });

  it('should exclude bunches that are in changedBunches', () => {
    const changedBunches = ['bunch1', 'bunch3'];
    const result = getBunchesWithoutChanges(changedBunches, mockLocalBunches);
    expect(result).toEqual({
      bunch2: {
        item3: { id: 'item3', name: 'Item 3' },
      },
    });
  });

  it('should return empty object when all bunches are changed', () => {
    const changedBunches = ['bunch1', 'bunch2', 'bunch3'];
    const result = getBunchesWithoutChanges(changedBunches, mockLocalBunches);
    expect(result).toEqual({});
  });

  it('should return empty object when localBunches is empty', () => {
    const changedBunches = ['bunch1'];
    const result = getBunchesWithoutChanges(changedBunches, {});
    expect(result).toEqual({});
  });

  it('should return empty object when localBunches is null or undefined', () => {
    const changedBunches = ['bunch1'];
    expect(getBunchesWithoutChanges(changedBunches, null as any)).toEqual({});
    expect(getBunchesWithoutChanges(changedBunches, undefined as any)).toEqual({});
  });

  it('should handle case when changedBunches contains non-existent bunch ids', () => {
    const changedBunches = ['nonexistentBunch', 'bunch2'];
    const result = getBunchesWithoutChanges(changedBunches, mockLocalBunches);
    expect(result).toEqual({
      bunch1: {
        item1: { id: 'item1', name: 'Item 1' },
        item2: { id: 'item2', name: 'Item 2' },
      },
      bunch3: {
        item4: { id: 'item4', name: 'Item 4' },
      },
    });
  });

  it('should preserve the structure of unchanged bunches', () => {
    const changedBunches = ['bunch2'];
    const result = getBunchesWithoutChanges(changedBunches, mockLocalBunches);
    expect(result.bunch1).toEqual(mockLocalBunches.bunch1);
    expect(result.bunch3).toEqual(mockLocalBunches.bunch3);
    expect(result.bunch2).toBeUndefined();
  });
});

// npm run test:unit get-bunches-without-changes.test.ts
