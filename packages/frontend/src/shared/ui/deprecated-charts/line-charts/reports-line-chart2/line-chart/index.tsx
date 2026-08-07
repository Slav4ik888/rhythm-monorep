import { FC } from 'react';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { MDBox } from '../../../../mui-design-components';
import { configs } from './configs';
import { GreyColor, GradientColorName } from 'app/providers/theme';
import { ChartConfig } from 'entities/charts';



interface Props {
  chart    : ChartConfig
  bgColor? : GradientColorName | GreyColor
}


export const LineChartContainer: FC<Props> = ({ bgColor, chart }) => {
  const { data, options } = configs(chart.labels, chart.datasets, chart.options);


  return (
    <MDBox
      // variant="gradient"
      bgColor       = {bgColor}
      borderRadius  = 'lg'
      coloredShadow = 'secondary'
      height        = '20rem'
      py            = {2}
      pr            = {0.5}
      mt            = {-5}
    >
      {/* @ts-ignore */}
      <Chart type='line' data={data} options={options} />
    </MDBox>
  );
}
