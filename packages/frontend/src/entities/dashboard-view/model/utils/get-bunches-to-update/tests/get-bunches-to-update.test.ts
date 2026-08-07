import { BunchesUpdated } from 'shared/lib/structures/bunch';
import { getBunchesToUpdate } from '..';



describe('getBunchesToUpdate', () => {
  const mockServerData: BunchesUpdated = {
    'bunch1': 1000,
    'bunch2': 2000,
    'bunch3': 3000
  };

  test('should return all bunches when no local data', () => {
    const result = getBunchesToUpdate(mockServerData);
    expect(result.sort()).toEqual(['bunch1', 'bunch2', 'bunch3']);
  });

  test('should return only outdated bunches', () => {
    const localData: BunchesUpdated = {
      'bunch1': 1000,  // Актуальная
      'bunch2': 1500   // Устаревшая (серверная 2000)
    };

    const result = getBunchesToUpdate(mockServerData, localData);
    expect(result).toEqual(['bunch2', 'bunch3']);
  });

  test('should return empty array if all up-to-date', () => {
    const localData: BunchesUpdated = {
      'bunch1': 1000,
      'bunch2': 2000,
      'bunch3': 3000
    };

    const result = getBunchesToUpdate(mockServerData, localData);
    expect(result).toEqual([]);
  });

  test('should handle empty server data', () => {
    const result = getBunchesToUpdate({}, { 'bunch1': 1000 });
    expect(result).toEqual([]);
  });

  test('should handle new server bunches', () => {
    const localData: BunchesUpdated = {
      'bunch1': 1000
    };

    const result = getBunchesToUpdate(mockServerData, localData);
    expect(result.sort()).toEqual(['bunch2', 'bunch3']);
  });
});

// npm run test:unit get-bunches-to-update.test.ts
