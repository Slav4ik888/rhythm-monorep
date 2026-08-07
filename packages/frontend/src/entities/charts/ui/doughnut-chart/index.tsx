import { FC } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { ChartConfig } from '../../types';
import { doughnutConfig } from './config';



interface Props {
  chart: ChartConfig
}

export const DoughnutChart: FC<Props> = ({ chart }) => {
  const { data, options } = doughnutConfig(chart);

  return (
    <Chart type='doughnut' data={data} options={options} />
  );
}
