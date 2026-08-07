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

import { setValue } from 'shared/helpers/objects';
import { ChartConfigDatasets, ChartConfigOptions } from '../../../../../../../entities/charts/types';


export function configs(
  // eslint-disable-next-line default-param-last
  labels   : any[] = [],
  datasets : ChartConfigDatasets[],
  options  : ChartConfigOptions = {}
) {
  const { scales } = options;

  return {
    data: {
      labels,
      datasets: [
        {
          label                : datasets[0].label,
          tension              : 0,
          pointRadius          : setValue(datasets[0].pointRadius, 5), // Толщика точки (круглешков)
          pointBorderColor     : 'transparent',
          pointBackgroundColor : setValue(datasets[0].pointBackgroundColor, 'rgba(255, 255, 255, .8)'),
          borderColor          : setValue(datasets[0].borderColor, 'rgba(255, 255, 255, .8)'),
          borderWidth          : setValue(datasets[0].borderWidth, 3), // Толщика линии
          backgroundColor      : setValue(datasets[0].backgroundColor, 'transparent'),
          fill                 : setValue(datasets[0].fill, true),
          data                 : datasets[0].data,
          maxBarThickness      : 6,
        },
      ],
    },
    options: {
      responsive          : true,
      maintainAspectRatio : false,
      plugins: {
        legend: { // Легенда на графике
          display: false,
        },
      },
      interaction: {
        intersect : false,
        mode      : 'index',
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
            color           : setValue(scales?.y?.grid?.color, '#dadada'), // "rgba(255, 255, 255, .2)"),
          },
          // Подпись оси
          ticks: {
            display : true,
            color   : setValue(scales?.y?.ticks?.color, 'rgba(0, 0, 0, .8)'), // "#f8f9fa"),
            padding : 10,
            font    : {
              size       : setValue(scales?.y?.ticks?.font?.size, 10),
              weight     : 300,
              family     : 'Arial', // "Roboto",
              style      : 'normal',
              lineHeight : 2,
            },
          },
          // Добавление  мин / макс значения оси Y
          suggestedMin: setValue(scales?.y?.suggestedMin, null),
          suggestedMax: setValue(scales?.y?.suggestedMax, null),
        },
        x: {
          // Вертикальные линии от оси X
          grid: {
            display         : setValue(scales?.x?.grid?.display, true),
            drawBorder      : true,
            drawOnChartArea : false,
            drawTicks       : false, // Насечки на оси
            borderDash      : [5, 5],
            color           : setValue(scales?.x?.grid?.color, '#dadada'), // "rgba(255, 255, 255, .2)"),
          },
          // Подпись оси
          ticks: {
            display : true,
            color   : setValue(scales?.x?.ticks?.color, 'rgba(0, 0, 0, .8)'), // "#f8f9fa"),
            padding : 10,
            font    : {
              size       : setValue(scales?.x?.ticks?.font?.size, 10),
              weight     : 300,
              family     : 'Arial', // "Roboto",
              style      : 'normal',
              lineHeight : 2,
            },
          },
        },
      },
    },
  };
}
