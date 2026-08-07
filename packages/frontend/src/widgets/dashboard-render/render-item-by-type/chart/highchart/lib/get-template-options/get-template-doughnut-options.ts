import { TEMPLATE_COLORS } from '../../../chartjs/lib';



export const getTemplateDoughnutOptions = (): Highcharts.Options => {
  const type = 'pie';

  return {
    chart: {
      type,
      options3d: {
        enabled: true,
        alpha: 45
      },
      backgroundColor: 'transparent',
    },
    colors: TEMPLATE_COLORS,
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    plotOptions: {
      pie: {
        innerSize: '30%',
        depth: 25
      }
    },
    series: [{
      type,
      name: '', // Название, показывается при наведении на "кусок" пирога
      dataLabels: {
        enabled: false // отключает подписи значений
      },
      data: [
        ['Техника', 10],
        ['Оборудование', 20],
        ['Текстиль', 15],
        ['Плёнка', 75],
        ['Станки', 3],
        ['Продукты', 13]
      ]
    }]
  }
}
