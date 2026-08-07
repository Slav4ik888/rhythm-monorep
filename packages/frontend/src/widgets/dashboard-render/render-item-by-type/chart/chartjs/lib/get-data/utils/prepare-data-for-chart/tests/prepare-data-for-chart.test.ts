import { DashboardStatisticItem } from 'entities/dashboard-data';
import { prepareDataForChart } from '..';



describe('prepareDataForChart', () => {
  const allActiveDates1 = {
    week: [
      1747353600000, // '16.05.2025', 2
      1747958400000, // '23.05.2025',
      1748563200000, // '30.05.2025',
      1749168000000, // '06.06.2025',
      1749772800000, // '13.06.2025',
      1750377600000, // '20.06.2025',
      1750982400000, // '27.06.2025',
      1751587200000, // '04.07.2025',
      1752192000000, // '11.07.2025',
      1752796800000, // '18.07.2025',
      1753401600000, // '25.07.2025',
      1754006400000, // '01.08.2025',
      1754611200000, // '08.08.2025',
      1755216000000, // '15.08.2025',
      1755820800000, // '22.08.2025',
      1756425600000, // '29.08.2025',
      1757030400000, // '05.09.2025',
      1757635200000, // '12.09.2025',
      1758240000000, // '19.09.2025',
      1758844800000  // '26.09.2025'
    ],
    month: [
      1747342800000, // '16.05.2025', 1
      1749157200000, // '06.06.2025',
      1751576400000, // '04.07.2025',
      1753995600000, // '01.08.2025',
      1757019600000  // '05.09.2025'
    ]
  };

  test('periodType === greatest', () => {
    const monthItemData = {
      periodType :  'week',
      data       : [1, 2, 3, 4, 5]
    }
    expect(prepareDataForChart(monthItemData as DashboardStatisticItem<number>, { data: [] }, allActiveDates1, 'week'))
      .toEqual([1, 2, 3, 4, 5]);
  });

  test('periodType !== greatest, isFirstGreatestDate = false', () => {
    const monthItemData = {
      periodType :  'month',
      data       : [1, 2, 3, 4, 5]
    };

    const result = prepareDataForChart(monthItemData as DashboardStatisticItem<number>, { data: [] }, allActiveDates1, 'week');

    expect(result).toEqual([1, NaN, NaN, 2, NaN, NaN, NaN, 3, NaN, NaN, NaN, 4, NaN, NaN, NaN, NaN, 5, NaN, NaN, NaN]);
    expect(result.length).toEqual(allActiveDates1.week.length);
  });



  test('periodType !== greatest, isFirstGreatestDate = true', () => {
    const allActiveDates2 = {
      week: [
        1747342100000, // '16.05.2025', 1
        1747353600000, // '16.05.2025', 3
        1747958400000, // '23.05.2025',
        1748563200000, // '30.05.2025',
        1749168000000, // '06.06.2025',
        1749772800000, // '13.06.2025',
        1750377600000, // '20.06.2025',
        1750982400000, // '27.06.2025',
        1751587200000, // '04.07.2025',
        1752192000000, // '11.07.2025',
        1752796800000, // '18.07.2025',
        1753401600000, // '25.07.2025',
        1754006400000, // '01.08.2025',
        1754611200000, // '08.08.2025',
        1755216000000, // '15.08.2025',
        1755820800000, // '22.08.2025',
        1756425600000, // '29.08.2025',
        1757030400000, // '05.09.2025',
        1757635200000, // '12.09.2025',
        1758240000000, // '19.09.2025',
        1758844800000  // '26.09.2025'
      ],
      month: [
        1747342800000, // '16.05.2025', 2
        1749157200000, // '06.06.2025',
        1751576400000, // '04.07.2025',
        1753995600000, // '01.08.2025',
        1757019600000  // '05.09.2025'
      ]
    };

    const monthItemData = {
      periodType :  'month',
      data       : [1, 2, 3, 4, 5]
    };

    const result = prepareDataForChart(monthItemData as DashboardStatisticItem<number>, { data: [] }, allActiveDates2, 'week');

    expect(result).toEqual([NaN, 1, NaN, NaN, 2, NaN, NaN,  NaN, 3, NaN, NaN, NaN, 4, NaN, NaN, NaN, NaN, 5, NaN, NaN, NaN]);
    expect(result.length).toEqual(allActiveDates2.week.length);
  });



  // Там где есть равные даты
  const allActiveDates3 = {
    week: [
      1747342800000, // '16.05.2025',
      1747958400000, // '23.05.2025',
      1748563200000, // '30.05.2025',
      1749157200000, // '06.06.2025',
      1749772800000, // '13.06.2025',
      1750377600000, // '20.06.2025',
      1750982400000, // '27.06.2025',
      1751587200000, // '04.07.2025',
      1752192000000, // '11.07.2025',
      1752796800000, // '18.07.2025',
      1753401600000, // '25.07.2025',
      1754006400000, // '01.08.2025',
      1754611200000, // '08.08.2025',
      1755216000000, // '15.08.2025',
      1755820800000, // '22.08.2025',
      1756425600000, // '29.08.2025',
      1757019600000, // '05.09.2025',
      1757635200000, // '12.09.2025',
      1758240000000, // '19.09.2025',
      1758844800000  // '26.09.2025'
    ],
    month: [
      1747342800000, // '16.05.2025', +
      1749157200000, // '06.06.2025', +
      1751576400000, // '04.07.2025',
      1753995600000, // '01.08.2025',
      1757019600000  // '05.09.2025', +
    ]
  };

  test('periodType !== greatest, isFirstGreatestDate = true + есть равные даты', () => {
    const monthItemData = {
      periodType :  'month',
      data       : [1, 2, 3, 4, 5]
    };

    const result = prepareDataForChart(monthItemData as DashboardStatisticItem<number>, { data: [] }, allActiveDates3, 'week');

    expect(result).toEqual([1, NaN, NaN, 2, NaN, NaN,  NaN, 3, NaN, NaN, NaN, 4, NaN, NaN, NaN, NaN, 5, NaN, NaN, NaN]);
    expect(result.length).toEqual(allActiveDates3.week.length);
  });

  test('periodType !== greatest, shiftValues = 10', () => {
    const monthItemData = {
      periodType :  'month',
      data       : [1, 2, 3, 4, 5]
    };

    const result = prepareDataForChart(monthItemData as DashboardStatisticItem<number>, { data: [], shiftValues: -10 }, allActiveDates3, 'week');

    expect(result).toEqual([-9, NaN, NaN, -8, NaN, NaN,  NaN, -7, NaN, NaN, NaN, -6, NaN, NaN, NaN, NaN, -5, NaN, NaN, NaN]);
    expect(result.length).toEqual(allActiveDates3.week.length);
  });
});

// npm run test:unit prepare-data-for-chart.test.ts
