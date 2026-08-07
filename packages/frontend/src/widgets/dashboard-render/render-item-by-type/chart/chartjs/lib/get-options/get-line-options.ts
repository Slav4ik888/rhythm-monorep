import { ChartConfigOptions } from 'entities/charts';
// @ts-ignore
import { InteractionMode } from 'node_modules/chart.js/dist/types/index.d.ts';
import { updateObject, setValue } from 'shared/helpers/objects';



export const getLineOptions = (options = {} as ChartConfigOptions): ChartConfigOptions => {
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
      intersect : false, // true - событие срабатывает только если курсор пересекает элемент (например, находится прямо над точкой или столбцом)
      mode      : 'index' as InteractionMode,
    },
    scales: {
      y: {
        // Горизонтальные линии от оси Y
        grid: {
          display         : setValue(scales?.y?.grid?.display,         true),
          drawBorder      : setValue(scales?.y?.grid?.drawBorder,      false),
          drawOnChartArea : setValue(scales?.y?.grid?.drawOnChartArea, true),
          drawTicks       : setValue(scales?.y?.grid?.drawTicks,       false), // Насечки на оси
          borderDash      : [5, 5],
          color           : setValue(scales?.y?.grid?.color, '#dadada'),
        },
        // Подпись оси
        ticks: {
          display : setValue(scales?.y?.ticks?.display, true),
          color   : setValue(scales?.y?.ticks?.color, 'rgba(0, 0, 0, .8)'),
          padding : 10,
          font    : {
            size       : setValue(scales?.y?.ticks?.font?.size, 10),
            weight     : 300,
            family     : 'Arial', // 'Roboto'
            style      : 'normal',
            lineHeight : 2,
          },
        },
        // Добавление  мин / макс значения оси Y
        suggestedMin: setValue(scales?.y?.suggestedMin, undefined),
        suggestedMax: setValue(scales?.y?.suggestedMax, undefined),
      },
      x: {
        // Вертикальные линии от оси X
        grid: {
          display         : setValue(scales?.x?.grid?.display,         true),
          drawBorder      : setValue(scales?.x?.grid?.drawBorder,      true),
          drawOnChartArea : setValue(scales?.x?.grid?.drawOnChartArea, false),
          drawTicks       : setValue(scales?.x?.grid?.drawTicks,       false), // Насечки на оси
          borderDash      : [5, 5],
          color           : setValue(scales?.x?.grid?.color, '#dadada'),
        },
        // Подпись оси
        ticks: {
          display : setValue(scales?.x?.ticks?.display, true),
          color   : setValue(scales?.x?.ticks?.color, 'rgba(0, 0, 0, .8)'),
          padding : 10,
          font    : {
            size       : setValue(scales?.x?.ticks?.font?.size, 10),
            weight     : 300,
            family     : 'Arial', // 'Roboto'
            style      : 'normal',
            lineHeight : 2,
          },
        },
      },
    },
  }, options);
}
