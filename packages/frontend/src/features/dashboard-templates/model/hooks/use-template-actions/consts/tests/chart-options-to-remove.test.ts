// packages/frontend/src/features/dashboard-templates/model/hooks/use-template-actions/consts/tests/chart-options-to-remove.test.ts
// Unit-тест списка опций чарта, сбрасываемых при копировании элемента в шаблон.

import { chartOptionsToRemove } from '..';

describe('chartOptionsToRemove', () => {
  it('содержит пути опций шкалы Y, которые нужно удалить при копировании', () => {
    expect(chartOptionsToRemove).toEqual([
      'settings.chartOptions.scales.y.min',
      'settings.chartOptions.scales.y.max',
      'settings.chartOptions.scales.y.suggestedMin',
      'settings.chartOptions.scales.y.suggestedMax',
    ]);
  });

  it('содержит только валидные пути (начинаются с settings.chartOptions.scales.y)', () => {
    chartOptionsToRemove.forEach((path) => {
      expect(path).toMatch(/^settings\.chartOptions\.scales\.y\./);
    });
  });
});
