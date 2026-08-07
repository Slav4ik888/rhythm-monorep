import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import { getStyles } from './styles';



interface Props {
  dirFontSize   : number | undefined
  fontSize      : number | undefined,
  dirFontWeight : number | undefined,
  fontWeight    : number | undefined,
  lineHeight    : number | undefined
  reduction     : string
  color         : string
}

/** Reduction */
export const ItemDigitIndicatorReduction: FC<Props> = memo(({ reduction, ...rest }) => (
  <Typography component='span' sx={getStyles(rest)}>
    {reduction}
  </Typography>
));
