import { FC, ReactNode } from 'react';
import Card from '@mui/material/Card';
import { SxCard } from 'shared/styles';



interface Props {
  sx?      : SxCard
  children : ReactNode
}


/** Контейнер для задания размеров и фона для графика */
export const ChartContainer: FC<Props> = ({ sx, children }) => (
  <Card sx={sx?.root}>
    {
      children
    }
  </Card>
);
