import { FC, memo, MouseEvent, useMemo } from 'react';
import { InputByScheme } from '../../../base-features-components';
import { RowWrapperTitle, Toward, TowardType } from 'shared/ui/configurators-components';
import { ViewItem } from 'entities/dashboard-view';
import { f, pxToRem } from 'shared/styles';
import { ColorPicker } from 'shared/lib/colors-picker';
import { getValueByScheme } from 'shared/helpers/objects';
import Box from '@mui/material/Box';
import { DeleteButton } from 'shared/ui/buttons/delete-button';
import Typography from '@mui/material/Typography';



const sxPopover = {
  popover: {
    bottom: pxToRem(-260)
  },
};

interface Props {
  selectedItem  : ViewItem | undefined
  index         : number
  onChangeColor : (index: number, color: string) => void
  onToward      : (index: number, type: TowardType) => void
  onDel         : (index: number) => void
}

export const GaugeColumnOneParameter: FC<Props> = memo(({ selectedItem, index, onChangeColor, onToward, onDel }) => (
  <RowWrapperTitle
    title     = {`Параметр - ${index + 1}`}
    toolTitle = 'Название, значения и цвет параметра'
    sx        = {{
      root: {
        position: 'relative',
        ...f('-fs'),
        gap : 0.5,
        my  : 1
      }
    }}
  >
    <Box sx={{ ...f('c'), gap: 1 }}>
      <Box sx={{ ...f('-c-fe'), gap: 2 }}>
        <InputByScheme
          scheme       = {`settings.gaugeColumnItems[${index}].label`}
          width        = {pxToRem(170)}
          selectedItem = {selectedItem}
          onChange     = {(e: MouseEvent, v: string | number) => {}}
        />
        <ColorPicker
          defaultColor = {getValueByScheme(selectedItem, `settings.gaugeColumnItems[${index}].color`)}
          sx           = {index < 1 ? sxPopover : {}} // Чтобы верхний ColorPicker не перекрывался Tabs
          onChange     = {(color: string) => onChangeColor(index, color)}
        />
        <Toward
          type    = 'up'
          size    = 'small'
          onClick = {(type: TowardType) => onToward(index, type)}
        />
      </Box>

      <Box sx={{ ...f('-c-fe'), gap: 3 }}>
        <Box sx={{ ...f(), gap: 0.5 }}>
          <Typography component='span'>
            {'>='}
          </Typography>
          <InputByScheme
            type         = 'number'
            toolTitle    = 'Значение для условия ">="'
            scheme       = {`settings.gaugeColumnItems[${index}].valueMore`}
            width        = {pxToRem(85)}
            selectedItem = {selectedItem}
            onChange     = {(e: MouseEvent, v: string | number) => {}}
          />
        </Box>
        <Box sx={{ ...f(), gap: 0.5 }}>
          <Typography component='span'>
            {'<'}
          </Typography>
          <InputByScheme
            type         = 'number'
            toolTitle    = 'Значение для условия "<"'
            scheme       = {`settings.gaugeColumnItems[${index}].valueLess`}
            width        = {pxToRem(85)}
            selectedItem = {selectedItem}
            onChange     = {(e: MouseEvent, v: string | number) => {}}
          />
        </Box>

        <Toward
          type    = 'down'
          size    = 'small'
          onClick = {(type: TowardType) => onToward(index, type)}
        />
      </Box>
    </Box>

    <DeleteButton
      icon
      toolTitle = 'Удалить параметр'
      sx        = {{
        root: {
          position : 'absolute',
          top      : pxToRem(21),
          right    : pxToRem(-25),
        },
        icon: {
          fontSize : '1.2rem',
        }
      }}
      onDel     = {() => onDel(index)}
    />
  </RowWrapperTitle>
));
