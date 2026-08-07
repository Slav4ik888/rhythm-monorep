import { FC } from 'react';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { lineConfig } from './config';
import { ChartConfig } from '../../types';



interface Props {
  chart: ChartConfig
}


export const LineChart: FC<Props> = ({ chart }) => {
  const { data, options } = lineConfig(chart);


  return (
    <Chart type='line' data={data} options={options} />
  );
}
