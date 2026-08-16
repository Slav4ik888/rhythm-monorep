// packages/frontend/src/features/dashboard-data/get-data/model/services/get-data/utils/transform-gs-data/tests/transform-gs-data.test.ts
// Unit-тест утилит преобразования данных Google Sheets.

import { transformGSData, getEntities } from '..';

describe('transformGSData', () => {
  it('транспонирует строки таблицы в столбцы', () => {
    const rows = [
      ['a', 'b', 'c'],
      [1, 2, 3],
      [4, 5, 6],
    ];

    expect(transformGSData(rows)).toEqual([
      ['a', 1, 4],
      ['b', 2, 5],
      ['c', 3, 6],
    ]);
  });

  it('возвращает пустой массив для пустых данных', () => {
    expect(transformGSData([])).toEqual([]);
  });
});

describe('getEntities', () => {
  it('извлекает startEntities и startDates из данных вкладки', () => {
    // Первая строка: B1 — тип статистики вкладки, B2 — номер строки начала данных.
    // Якоря (#kod/#periodType/...) расположены в первом столбце по строкам.
    const data = {
      Лист1: [
        ['', 'month'],
        ['', 8],
        ['#kod', 'metricA'],
        ['#periodType', 'month'],
        ['#companyType', 'ООО'],
        ['#productType', 'Товар'],
        ['#title', 'Продажи'],
        ['2024-01-01', 100],
        ['2024-02-01', 110],
      ],
    };

    const result = getEntities(data);

    expect(result.startEntities).toEqual({
      metricA: {
        kod: 'metricA',
        periodType: 'month',
        companyType: 'ООО',
        productType: 'Товар',
        title: 'Продажи',
        data: [100, 110],
      },
    });

    expect(result.startDates).toEqual({
      month: [new Date('2024-01-01').getTime(), new Date('2024-02-01').getTime()],
    });
  });

  it('не добавляет метрику, если тип периода не совпадает с типом вкладки', () => {
    const data = {
      Лист1: [
        ['', 'week'],
        ['', 8],
        ['#kod', 'metricA'],
        ['#periodType', 'month'],
        ['#companyType', 'ООО'],
        ['#productType', 'Товар'],
        ['#title', 'Продажи'],
        ['2024-01-01', 100],
      ],
    };

    const result = getEntities(data);

    expect(result.startEntities).toEqual({});
  });
});
