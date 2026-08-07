import { FC, memo, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { Increased } from 'entities/dashboard-data';
import { getStyles } from './styles';
import { getInverted } from '../..';
import { useDashboardViewState, ViewItem } from 'entities/dashboard-view';



interface Props {
  item       : ViewItem
  fontSize   : number | undefined
  lineHeight : number | undefined
  increased  : Increased
  color      : string
}

/**
 * Знак + или -
 */
export const ItemDigitIndicatorPlusMinus: FC<Props> = memo(({ increased, item, ...rest }) => {
  const { entities } = useDashboardViewState();

  // если значения отрицательные то падение статистики будет без '-' и надо его добавить
  const char = useMemo(() => {
    const isInverted = getInverted(item, entities);

    return increased === 1
      ? isInverted ? '-' : '+'   // Меняем наоборот если инвертировано
      : increased === -1
        ? isInverted ? '+' : '-' // Меняем наоборот если инвертировано
        : ''
  }, [item, increased, entities]);


  return (
    <Typography component='span' sx={getStyles(rest)}>
      {
        char
      }
    </Typography>
  )
});
