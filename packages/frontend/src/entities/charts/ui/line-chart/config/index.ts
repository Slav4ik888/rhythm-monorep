/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { ChartConfig, ChartConfigOptions, ChartFontStyle } from '../../../types';
// @ts-ignore
import { InteractionMode } from 'node_modules/chart.js/dist/types/index.d.ts';
import { updateObject, setValue } from 'shared/helpers/objects';



/** Line config */
export function lineConfig(chartConfig: ChartConfig) {
  const {
    labels,
    datasets,
    options  = {} as ChartConfigOptions
  } = chartConfig
  const { scales } = options;

  return {
    data: {
      labels,
      datasets: [...datasets.map(item => ({
        label                : item.label,
        data                 : item.data,
        tension              : 0,
        pointRadius          : setValue(item.pointRadius, 5), // Толщика точки (круглешков)
        pointBorderColor     : 'transparent',
        pointBackgroundColor : setValue(item.pointBackgroundColor, 'rgba(255, 255, 255, .8)'),
        borderColor          : setValue(item.borderColor, 'rgba(255, 255, 255, .8)'),
        borderWidth          : setValue(item.borderWidth, 3), // Толщика линии
        backgroundColor      : setValue(item.backgroundColor, 'transparent'),
        fill                 : setValue(item.fill, true),
        maxBarThickness      : 6,
      }))],
    },
    options: updateObject({
      responsive          : true,
      maintainAspectRatio : false,
      plugins: {
        legend: { // Легенда на графике
          display: false,
        },
      },
      interaction: {
        intersect : false,
        mode      : 'index' as InteractionMode,
      },
      scales: {
        y: {
          // Горизонтальные линии от оси Y
          grid: {
            display         : setValue(scales?.y?.grid?.display, true),
            drawBorder      : false,
            drawOnChartArea : true,
            drawTicks       : false, // Насечки на оси
            borderDash      : [5, 5],
            color           : setValue(scales?.y?.grid?.color, '#dadada'), // 'rgba(255, 255, 255, .2)'),
          },
          // Подпись оси
          ticks: {
            display : true,
            color   : setValue(scales?.y?.ticks?.color, 'rgba(0, 0, 0, .8)'), // '#f8f9fa'),
            padding : 10,
            font    : {
              size       : setValue(scales?.y?.ticks?.font?.size, 10),
              weight     : 300,
              family     : 'Arial', // 'Roboto',
              style      : 'normal' as ChartFontStyle,
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
            display         : setValue(scales?.x?.grid?.display, true),
            drawBorder      : true,
            drawOnChartArea : false,
            drawTicks       : false, // Насечки на оси
            borderDash      : [5, 5],
            color           : setValue(scales?.x?.grid?.color, '#dadada'), // 'rgba(255, 255, 255, .2)'),
          },
          // Подпись оси
          ticks: {
            display : true,
            color   : setValue(scales?.x?.ticks?.color, 'rgba(0, 0, 0, .8)'), // '#f8f9fa'),
            padding : 10,
            font    : {
              size       : setValue(scales?.x?.ticks?.font?.size, 10),
              weight     : 300,
              family     : 'Arial', // 'Roboto',
              style      : 'normal' as ChartFontStyle,
              lineHeight : 2,
            },
          },
        },
      },
    }, options)
  };
}
