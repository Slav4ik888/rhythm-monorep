import { ChartConfigOptions } from 'entities/charts';
// @ts-ignore
import { InteractionMode } from 'node_modules/chart.js/dist/types/index.d.ts';
import { updateObject, setValue } from 'shared/helpers/objects';



export const getDoughnutOptions = (options = {} as ChartConfigOptions): ChartConfigOptions => {
  const { scales } = options;

  return updateObject({
    responsive          : true,
    maintainAspectRatio : false,
    plugins: {
      legend: { // Легенда на графике
        display: setValue(options.plugins?.legend?.display, false),
      },
    },
    interaction: {
      intersect : false,
      mode      : 'index' as InteractionMode,
    },
  }, options);
}
