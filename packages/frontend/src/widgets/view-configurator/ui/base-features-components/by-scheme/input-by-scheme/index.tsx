import { FC, memo, useCallback, MouseEvent, useMemo } from 'react';
import { Input, InputType, SxTextfield } from 'shared/ui/containers';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { getValueByScheme } from 'shared/helpers/objects';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import { updater } from '../utils';
import { f, pxToRem } from 'shared/styles';



export type SxInputByScheme = SxTextfield & {
  wrapper?: any
}


interface Props {
  selectedItem : ViewItem | undefined
  scheme       : string
  type?        : InputType
  width?       : string
  helperText?  : string
  toolTitle?   : string
  disabled?    : boolean
  sx?          : SxInputByScheme
  transform?   : (v: string | number) => string | number // Если полученное начальное значение нужно как-либо преобразовать. Например, 'boxShadow': 'rgba(184, 184, 184, 1)'
  clear?       : string | number // Если нужно, чтобы при очистке значения, была не пустая строка '', а что-то другое
  onClear?     : () => void      // Если нужно, чтобы для очистки значения, была другая функция
  onBlur?      : (e: MouseEvent, v: string | number) => void // Если нужна не стандартная обработка
  onChange?    : (e: MouseEvent, v: string | number) => void // Если нужна не стандартная обработка
  onSubmit?    : (e: MouseEvent, v: string | number) => void // Если нужна не стандартная обработка
}


/**
 * Input update ViewItem
 * По схеме сохраняет изменени в selectedItem
 * в том числе scheme with array
 */
export const InputByScheme: FC<Props> = memo(({
  selectedItem, scheme, width, sx, helperText, toolTitle, clear, disabled,
  type = 'text',
  transform, onClear, onBlur, onChange, onSubmit
}) => {
  // const sx = getStyles(useTheme(), style, width);
  const { updateViewItems } = useDashboardViewActions();

  const value = useMemo(() => {
    if (! selectedItem) return '';

    // '' - чтобы сработал changesValue
    // ?? - чтобы если 0 то он был показан, а не заменён на ''
    const v = getValueByScheme(selectedItem, scheme) ?? '';
    return transform ? transform(v) : v
  }, [selectedItem, scheme, transform]);


  const handleUpdate = useCallback((v: string | number) => {
    updater(v, selectedItem, scheme, updateViewItems);
  }, [selectedItem, scheme, updateViewItems]);


  // Change - приходит тот тип, что указали в type
  const handleChange = useCallback((e: MouseEvent, v: string | number) => {
    if (onChange) onChange(e, v);
    else handleUpdate(v);
  }, [handleUpdate, onChange]);

  // Submit
  const handleSubmit = useCallback((e: MouseEvent, v: string | number) => {
    if (onSubmit) onSubmit(e, v);
    else handleUpdate(v);
  }, [handleUpdate, onSubmit]);

  // Blur
  const handleBlur = useCallback((e: MouseEvent, v: string | number) => {
    if (onBlur) onBlur(e, v);
    else handleSubmit(e, v);
  }, [handleSubmit, onBlur]);

  // Clear
  const handleClear = useCallback((e: MouseEvent) => {
    if (onClear) onClear()
    else handleSubmit(e, clear !== undefined ? clear : '');
  }, [clear, onClear, handleSubmit]);


  return (
    <Box
      sx={{
        position: 'relative',
        ...f('-fs-fs'),
        width: width || pxToRem(80),
        ...sx?.wrapper,
      }}
    >
      <Input
        type         = {type}
        defaultValue = {value}
        changesValue = {value}
        helperText   = {helperText}
        toolTitle    = {toolTitle}
        disabled     = {disabled}
        onBlur       = {handleBlur}
        onChange     = {handleChange}
        onSubmit     = {handleSubmit}
        sx           = {{
          root: {
            width: width || pxToRem(80),
            ...sx?.root,
            '& .MuiFormHelperText-root': {
              color: 'text.light'
            }
          },
          field: {
            width: width || pxToRem(80),
            ...sx?.field,
          },
          input: {
            fontSize  : `${pxToRem(18)} !important`,
            height    : pxToRem(20),
            textAlign : 'center',
            padding   : pxToRem(4),
            ...sx?.input,
          }
        }}
      />
      {
        value || value === 0
          ? <ClearIcon
              onClick = {handleClear}
              sx      = {{
                position : 'absolute',
                top      : pxToRem(-2),
                right    : pxToRem(-16),
                cursor   : 'pointer',
                fontSize : '0.9rem',
                color    : 'text.light',
              }}
            />
          : ''
      }
    </Box>
  )
});
