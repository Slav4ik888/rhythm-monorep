import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f, pxToRem } from 'shared/styles';
import { DelChart } from './del-chart';
import { MoveChartUpdownward } from './move-chart-updownward';



const useStyles = () => ({
  row: {
    ...f('-c-fe'),
    gap : pxToRem(8),
    my  : 1
  }
});


interface Props {
  index: number // Index charts in settings.charts
}

/** Control chart bar */
export const ControlChartBar: FC<Props> = memo(({ index }) => {
  const sx = useStyles();


  return (
    <Box sx={sx.row}>
      <DelChart index={index} />
      <MoveChartUpdownward index={index} />
    </Box>
  )
});
