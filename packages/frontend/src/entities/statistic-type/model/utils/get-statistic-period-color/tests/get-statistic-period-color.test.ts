import type { CustomTheme } from 'app/providers/theme';
import type { CustomSettings } from 'entities/company';
import { gelStatisticPeriodColor } from '..';

const theme = {
  palette: {
    statisticPeriodTypeChip: {
      day: { color: '#dadada', background: 'braun' },
    },
  },
} as unknown as CustomTheme;

describe('gelStatisticPeriodColor', () => {
  it('предпочитает цвет из customSettings', () => {
    const customSettings: CustomSettings = {
      periodType: { day: { color: '#ff0000', background: '#00ff00' } },
    };

    expect(gelStatisticPeriodColor('color', 'day', theme, customSettings)).toBe('#ff0000');
    expect(gelStatisticPeriodColor('background', 'day', theme, customSettings)).toBe('#00ff00');
  });

  it('берёт цвет из темы, если в customSettings его нет', () => {
    expect(gelStatisticPeriodColor('color', 'day', theme)).toBe('#dadada');
    expect(gelStatisticPeriodColor('background', 'day', theme)).toBe('braun');
  });

  it('использует fallback, если цвета нет ни в customSettings, ни в теме', () => {
    expect(gelStatisticPeriodColor('color', 'week', theme)).toBe('#111111');
    expect(gelStatisticPeriodColor('background', 'week', theme)).toBe('#eee');
  });

  it('использует fallback при отсутствии темы для типа', () => {
    expect(gelStatisticPeriodColor('color', 'month_cal', theme)).toBe('#111111');
  });
});
