import type { CustomSettings } from 'entities/company';
import { gelStatisticPeriodLabel } from '..';

describe('gelStatisticPeriodLabel', () => {
  it('возвращает label из STATISTIC_PERIOD_TYPE для day', () => {
    expect(gelStatisticPeriodLabel('day')).toBe('Ден');
  });

  it('возвращает label из STATISTIC_PERIOD_TYPE для month_cal', () => {
    expect(gelStatisticPeriodLabel('month_cal')).toBe('МеК');
  });

  it('предпочитает title из customSettings', () => {
    const customSettings: CustomSettings = {
      periodType: { day: { title: 'Кастомный день' } },
    };

    expect(gelStatisticPeriodLabel('day', customSettings)).toBe('Кастомный день');
  });

  it('игнорирует customSettings для другого типа', () => {
    const customSettings: CustomSettings = {
      periodType: { week: { title: 'Кастомная неделя' } },
    };

    expect(gelStatisticPeriodLabel('day', customSettings)).toBe('Ден');
  });

  it('возвращает сам тип при отсутствии label и customSettings', () => {
    // @ts-expect-error — проверяем поведение с неизвестным типом
    expect(gelStatisticPeriodLabel('unknown')).toBe('unknown');
  });
});
