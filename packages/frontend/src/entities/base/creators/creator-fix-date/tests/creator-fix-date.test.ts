import { MOCK_DATE_13_03_2023 } from '../../../mocks';
import { MOCK_USER_ID } from '../../../../user/lib/mocks';
import { creatorFixDate } from '..';
import { getCurrentMs, sec } from 'shared/helpers/dates';



describe('creatorFixDate', () => {
  test('With userId & date', () => {
    expect(creatorFixDate(MOCK_USER_ID, MOCK_DATE_13_03_2023)).toEqual({
      userId : MOCK_USER_ID,
      date   : MOCK_DATE_13_03_2023
    });
  });

  test('With userId, but without date', () => {
    const res = creatorFixDate(MOCK_USER_ID);

    expect(res.userId).toBe(MOCK_USER_ID);

    expect(res.date).not.toBeUndefined();
    expect(res.date).toBeLessThan(getCurrentMs() + 1);
    expect(res.date).toBeGreaterThan(getCurrentMs() - sec(5));
  });

  test('Without userId, but with date', () => {
    const res = creatorFixDate(undefined, MOCK_DATE_13_03_2023);

    expect(res.userId).toBe('');
    expect(res.date).toBe(MOCK_DATE_13_03_2023);
  });

  test('Without userId & date', () => {
    const res = creatorFixDate();

    expect(res.userId).toBe('');
    expect(res.date).toBeLessThan(getCurrentMs() + 1);
    expect(res.date).toBeGreaterThan(getCurrentMs() - sec(5));
  });
});

// npm run test:unit creator-fix-date.test.ts
