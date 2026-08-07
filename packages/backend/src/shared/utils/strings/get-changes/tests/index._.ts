import { getChanges } from '..';
import { MOCK_STR_BASIC } from './mocks';


describe('getChanges', () => {
  test('getChanges', () => {
    expect(getChanges(MOCK_STR_BASIC, '')).toEqual([MOCK_STR_BASIC]);
  });
});

// npm run test:unit get-changes.test.ts
