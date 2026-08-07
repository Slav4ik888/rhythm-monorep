import { FC, memo } from 'react';
import { stylesToSx, ViewItemStyles } from 'entities/dashboard-view';
import Typography from '@mui/material/Typography';



const getStyles = (styles: ViewItemStyles | undefined, color: string) => {
  const root: any = stylesToSx(styles) || {};

  return {
    cursor: 'default',
    ...root,
    color,
  }
};


interface Props {
  styles : ViewItemStyles | undefined
  value  : string
  color  : string
  // kod    : string | undefined
}


/** Число */
export const ItemDigitIndicatorValue: FC<Props> = memo(({ styles, value, color }) => (
  // TODO: Tooltip убран тк он перекрывается  другим из ItemWrapper
  // Нужно туда перенести информацию про отсутствующее значение

  // const toolTitle = useMemo(() => {
  //   if (isUndefined(kod)) return 'Не выбран код статистики';
  //   if (value === '-') return 'Отсутствует значение статистики';
  //   return '';
  // }, [kod, value]);

  // <Tooltip title={toolTitle}>
  <Typography component='span' sx={getStyles(styles, color)}>
    {
      value
    }
  </Typography>
  // </Tooltip>
));
