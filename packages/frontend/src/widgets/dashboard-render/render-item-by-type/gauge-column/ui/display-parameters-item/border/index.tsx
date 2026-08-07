import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { isUndefined } from 'shared/lib/validators';



interface Props {
  isVertical      : boolean
  color           : string | undefined
  gaugeWidth      : number
  gaugeHeight     : number
  value           : number | string | undefined
  isTemplate?     : boolean // если рендерится шаблон
}


export const DisplayParameterBorder: FC<Props> = memo(({
  color, value, gaugeWidth, gaugeHeight, isVertical, isTemplate
}) => {
  if (isUndefined(value) || value === '') return null;

  const border = `1px dotted ${color || '#373737'}`;
  const width  = `${isVertical ? gaugeWidth : (gaugeHeight * (value as unknown as number))}px`;
  const height = `${isVertical ? (gaugeHeight * (value as unknown as number)) : gaugeWidth}px`;

  return (
    <Box
      sx={{
        position     : 'absolute',
        bottom       : 0,
        left         : 0,
        borderRadius : '0px',
        borderTop    : isVertical ? border : 'none',
        borderRight  : isVertical ? 'none' : border,
        width,
        height,
      }}
    />
  )
});
