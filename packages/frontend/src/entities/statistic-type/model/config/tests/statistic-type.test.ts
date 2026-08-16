import { STATISTIC_PERIOD_TYPE, arrayStatisticPeriodType } from '..';

describe('STATISTIC_PERIOD_TYPE', () => {
  it('содержит все типы периодов', () => {
    expect(Object.keys(STATISTIC_PERIOD_TYPE).sort()).toEqual(['day', 'month', 'month_cal', 'week']);
  });

  it('day имеет корректные label и description', () => {
    expect(STATISTIC_PERIOD_TYPE.day.label).toBe('Ден');
    expect(STATISTIC_PERIOD_TYPE.day.description).toBe('Ежедневная статистика');
  });

  it('week имеет корректные label и description', () => {
    expect(STATISTIC_PERIOD_TYPE.week.label).toBe('Нед');
    expect(STATISTIC_PERIOD_TYPE.week.description).toBe('Недельная статистика');
  });

  it('month и month_cal имеют корректные label', () => {
    expect(STATISTIC_PERIOD_TYPE.month.label).toBe('Мес');
    expect(STATISTIC_PERIOD_TYPE.month.description).toBe('Месячная статистика');
    expect(STATISTIC_PERIOD_TYPE.month_cal.label).toBe('МеК');
    expect(STATISTIC_PERIOD_TYPE.month_cal.description).toBe('Месячная статистика (по календарному месяцу)');
  });

  it('arrayStatisticPeriodType содержит ключи конфига', () => {
    expect([...arrayStatisticPeriodType].sort()).toEqual(['day', 'month', 'month_cal', 'week']);
  });
});
