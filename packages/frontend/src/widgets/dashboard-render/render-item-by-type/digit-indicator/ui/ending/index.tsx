import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import { getStyles } from './styles';
import { EndingType } from 'entities/dashboard-view';



interface Props {
  dirFontSize   : number | undefined
  fontSize      : number | undefined,
  dirFontWeight : number | undefined,
  fontWeight    : number | undefined,
  lineHeight    : number | undefined
  color         : string
  endingType    : EndingType | undefined
}
/** Префикс */
export const ItemDigitIndicatorEnding: FC<Props> = memo(({ endingType, ...rest }) => (
  <Typography component='span' sx={getStyles(rest)}>
    {endingType}
  </Typography>
));
