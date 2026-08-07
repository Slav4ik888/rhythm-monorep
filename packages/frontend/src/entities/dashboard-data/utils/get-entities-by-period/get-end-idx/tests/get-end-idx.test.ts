import { DashboardPeriodDates } from '../../../../types';
import { getEndIdx } from '..';
import { DashboardDataDates } from '../../../../model/slice/state-schema';



const startDates: DashboardDataDates = {
  мес : [
    1674669600000, // 1
    1677088800000, // 2
    1680112800000, // 3
    1682532000000, // 4
    1684951200000, // 5
    1687975200000, // 6
    1690394400000, // 7
    1693418400000, // 8 start - 1690491600001
    1695837600000, // 9
    1698256800000, // 10
    1701280800000, // 11
    1703700000000, // 12
    1706119200000, // 13
    1709143200000, // 14
    1711562400000, // 15
    1713981600000, // 16 end - 1714165200001
    1717005600000, // 17
    1719424800000, // 18
    1721844000000, // 19
    1724868000000  // 20
  ],
  нед: [
    1682532000000, // 1
    1684951200000, // 2
    1687975200000, // 3
    1690394400000, // 4
    1693418400000, // 5 start - 1690491600001
    1695837600000, // 6
    1698256800000, // 7
    1701280800000, // 8
    1703700000000, // 9
    1706119200000, // 10
    1709143200000, // 11
    1711562400000, // 12
    1713981600000, // 13 end - 1714165200001
    1717005600000, // 14
    1719424800000, // 15
    1721844000000, // 16
    1724868000000, // 17
    1724868000000, // 18
    1724868000000, // 19
    1724868000000  // 20
  ]
};



describe('getEndIdx', () => {
  test('valid data', () => {
    expect(getEndIdx(startDates['нед'], {
      start : 1690491600001, // "2023-07-27T21:00:00.001Z"
      end   : 1714165200001  // "2024-04-27T21:00:00.001Z"
    })).toEqual(12);
  });

  test('period is undefined', () => {
    expect(getEndIdx(startDates['мес'], undefined as unknown as DashboardPeriodDates)).toEqual(19);
  });

  test('period end -1690491600001', () => {
    expect(getEndIdx(startDates['мес'], {
      start : 1690491600001,
      end   : -1690491600001
    })).toEqual(0);
  });
  test('period end is undefined', () => {
    expect(getEndIdx(startDates['мес'], {
      start : 1690491600001,
      end   : undefined
    })).toEqual(19);
  });
});

// npm run test:unit get-end-idx.test.ts
