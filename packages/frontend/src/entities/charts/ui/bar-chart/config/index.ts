import { ChartConfig, ChartConfigDatasets, ChartConfigOptions } from '../../../types';
// @ts-ignore
import { ChartData } from 'node_modules/chart.js/dist/types/index.d.ts';
import { updateObject } from 'shared/helpers/objects';



interface BarConfig {
  data    : ChartData<'bar', (number | [number, number] | null)[], any>
  options : ChartConfigOptions
}

/** Bar config */
export function barConfig(chartConfig: ChartConfig): BarConfig {
  const {
    labels,
    datasets,
    options  = {} as ChartConfigOptions
  } = chartConfig
  // const { scales } = options;


  return {
    data: {
      labels,
      datasets: [...datasets.map(item => {
        const result: ChartConfigDatasets = {
          label : item.label,
          data  : item.data,
        };

        if (item.backgroundColor) result.backgroundColor = item.backgroundColor;
        if (item.borderColor)     result.borderColor = item.borderColor;
        if (item.borderWidth)     result.borderWidth = item.borderWidth;

        return result
      })]
    },
    options: updateObject({
      scales: {
        y: {
          // beginAtZero: true, // y axis starts at 0
        }
      }
    }, options),
  };
}
