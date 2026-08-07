import { FC, memo, MouseEvent } from 'react';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { ColorPicker } from 'shared/lib/colors-picker';
import { InputByScheme } from '../../../../base-features-components';
import { getBoxShadowValue } from './utils';
import { ViewItem, ViewItemStylesField } from 'entities/dashboard-view';



const sx = {
  wrapper: {
    mr: 2.5,
  },
  field: {
    width: '2rem',
  },
  input: {
    textAlign : 'center',
    padding   : '2px 4px',
  }
};


interface Props {
  field        : ViewItemStylesField
  selectedItem : ViewItem | undefined
  color        : string
  onChange     : (value: string | number, index: number) => void
}

/**
 * box-shadow component
 */
export const BoxShadowSetupComponent: FC<Props> = memo(({ field, selectedItem, color, onChange }) => (
  <Box sx={{ ...f('-c') }}>
    <InputByScheme
      type         = 'number'
      selectedItem = {selectedItem}
      scheme       = {`styles.${field}`}
      width        = '2rem'
      toolTitle    = 'offset-x'
      clear        = {0}
      sx           = {sx}
      transform    = {(v: string | number) => getBoxShadowValue(0, v)}
      onChange     = {(e: MouseEvent, v: string | number) => onChange(v, 0)}
      onBlur       = {(e: MouseEvent, v: string | number) => onChange(v, 0)}
      onSubmit     = {(e: MouseEvent, v: string | number) => onChange(v, 0)}
    />
    <InputByScheme
      type         = 'number'
      selectedItem = {selectedItem}
      scheme       = {`styles.${field}`}
      width        = '2rem'
      toolTitle    = 'offset-y'
      clear        = {0}
      sx           = {sx}
      transform    = {(v: string | number) => getBoxShadowValue(1, v)}
      onChange     = {(e: MouseEvent, v: string | number) => onChange(v, 1)}
      onBlur       = {(e: MouseEvent, v: string | number) => onChange(v, 1)}
      onSubmit     = {(e: MouseEvent, v: string | number) => onChange(v, 1)}
    />
    <InputByScheme
      type         = 'number'
      selectedItem = {selectedItem}
      scheme       = {`styles.${field}`}
      width        = '2rem'
      toolTitle    = 'blur-radius'
      clear        = {0}
      sx           = {sx}
      transform    = {(v: string | number) => getBoxShadowValue(2, v)}
      onChange     = {(e: MouseEvent, v: string | number) => onChange(v, 2)}
      onBlur       = {(e: MouseEvent, v: string | number) => onChange(v, 2)}
      onSubmit     = {(e: MouseEvent, v: string | number) => onChange(v, 2)}
    />
    <InputByScheme
      type         = 'number'
      selectedItem = {selectedItem}
      scheme       = {`styles.${field}`}
      width        = '2rem'
      toolTitle    = 'spread-radius'
      clear        = {0}
      sx           = {sx}
      transform    = {(v: string | number) => getBoxShadowValue(3, v)}
      onChange     = {(e: MouseEvent, v: string | number) => onChange(v, 3)}
      onBlur       = {(e: MouseEvent, v: string | number) => onChange(v, 3)}
      onSubmit     = {(e: MouseEvent, v: string | number) => onChange(v, 3)}
    />

    <ColorPicker
      defaultColor = {color}
      onChange     = {(v: string | number) => onChange(v, 4)}
    />
  </Box>
));
