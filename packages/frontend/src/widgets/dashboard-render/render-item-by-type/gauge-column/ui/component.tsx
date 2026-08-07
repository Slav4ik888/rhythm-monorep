import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { ViewItem } from 'entities/dashboard-view';
import { DisplayParametersItem } from './display-parameters-item';



interface Props {
  bgColor    : string
  height     : string // Высота колонки
  width      : string // Ширина колонки
  item       : ViewItem
  isVertical : boolean
}


export const ItemGaugeColumnComponent: FC<Props> = memo(({ isVertical, bgColor, width, height, item }) => (
  <Box
    sx={{
      position: 'relative',
      ...f('-c-c'),
      backgroundColor: bgColor,
      width,
      height,
    }}
  >
    {
      item?.settings?.displayParameters
      && item?.settings?.gaugeColumnItems
      && item?.settings?.gaugeColumnItems.map((gaugeColumnItem, index) => (
        <DisplayParametersItem
          key             = {index}
          item            = {item}
          isVertical      = {isVertical}
          gaugeColumnItem = {gaugeColumnItem}
        />
      ))
    }
  </Box>
));
