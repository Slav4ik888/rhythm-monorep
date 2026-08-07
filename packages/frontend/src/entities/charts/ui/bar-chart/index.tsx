import { FC } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { ChartConfig } from '../../types';
import { barConfig } from './config';



interface Props {
  chart: ChartConfig
}

export const BarChart: FC<Props> = ({ chart }) => {
  const { data, options } = barConfig(chart);

  return (
    <Chart type='bar' data={data} options={options} />
  );
}
