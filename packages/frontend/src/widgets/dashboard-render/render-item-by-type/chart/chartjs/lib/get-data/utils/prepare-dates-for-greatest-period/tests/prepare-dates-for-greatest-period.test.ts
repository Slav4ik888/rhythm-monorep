import { DashboardItemData, DashboardStatisticItem } from 'entities/dashboard-data';
import { prepareDatesForGreatestPeriod } from '..';



const allActiveDates = {
  WEEKLY: [
    1747353600000, 1747958400000, // '16.05.2025', '23.05.2025',
    1748563200000, 1749168000000, // '30.05.2025', '06.06.2025',
    1749772800000, 1750377600000, // '13.06.2025', '20.06.2025',
    1750982400000, 1751587200000, // '27.06.2025', '04.07.2025',
    1752192000000, 1752796800000, // '11.07.2025', '18.07.2025',
    1753401600000, 1754006400000, // '25.07.2025', '01.08.2025',
    1754611200000, 1755216000000, // '08.08.2025', '15.08.2025',
    1755820800000, 1756425600000, // '22.08.2025', '29.08.2025',
    1757030400000, 1757635200000, // '05.09.2025', '12.09.2025',
    1758240000000, 1758844800000  // '19.09.2025', '26.09.2025'
  ],
  MONTHLY: [
    1747342800000, // '16.05.2025',
    1749157200000, // '06.06.2025',
    1751576400000, // '04.07.2025',
    1753995600000, // '01.08.2025',
    1757019600000  // '05.09.2025'
  ]
};

describe('prepareDatesForGreatestPeriod', () => {
  test('prepareDatesForGreatestPeriod', () => {
    const itemsData = [
      {
        periodType: 'WEEKLY',
        data: [] as DashboardItemData<number>
      } as unknown as DashboardStatisticItem<number>,
      {
        periodType: 'MONTHLY',
        data: [] as DashboardItemData<number>
       } as unknown as DashboardStatisticItem<number>,
    ] as DashboardStatisticItem<number>[];

    expect(prepareDatesForGreatestPeriod(allActiveDates, itemsData as unknown as DashboardStatisticItem<number>[]))
      .toEqual({
        greatestPeriodType: 'WEEKLY',
        dates: allActiveDates.WEEKLY
      });
  });
});

// npm run test:unit prepare-dates-for-greatest-period.test.ts
