import { FC, memo, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import MuiTextField from '@mui/material/TextField';
import { GridWrap, GridStyle } from '../../grid-wrap';
import { BoxWrap } from '../../box-wrap';
import { Tooltip } from '../../../tooltip';
import { Errors, isNotUndefined } from 'shared/lib/validators';
import { getStrNumber, toNumber } from 'shared/helpers/numbers';



export type InputType = 'text' | 'number' | 'password' | 'email';
type Value = string | number;


const prepareValue = (typeNum: boolean, defaultValue: Value): string => typeNum
  ? getStrNumber(String(defaultValue))
  : defaultValue as string || '';



export interface SxTextfield {
  root?  : any
  field? : any
  input? : any
}



interface Props {
  grid?         : GridStyle
  sx?           : SxTextfield
  toolTitle?    : string
  label?        : string // The label content
  type?         : InputType
  name?         : string
  small?        : boolean
  shrink?       : boolean
  fullWidth?    : boolean
  defaultValue? : Value
  changesValue? : Value // If value can be changes in any place, but not here
  disabled?     : boolean
  isChange?     : boolean // Нужно ли делать setIsChange(true) при handlerBlur
  placeholder?  : string
  errorField?   : string
  errors?       : Errors
  autoFocus?    : boolean
  tabIndex?     : number
  helperText?   : string
  onTransform?  : <T, V>(v: T) => V // Transform default value
  onPrepeare?   : (v: Value) => void // Transform input value before save
  onClick?      : () => void
  onChange?     : (e: MouseEvent, v: Value) => void // Если нужно на каждое изменение
  onBlur?       : (e: MouseEvent, v: Value) => void
  onCallback?   : (e: MouseEvent, v: Value) => void // Calls in handlerChange
  onSubmit?     : (e: MouseEvent, v: Value) => void
}

/**
 * v.2025-01-21
 * @param onPrepeare - обрабатывать введённое значение ДО сохранения в onPrepeare
 */
export const Input: FC<Props> = memo((props) => {
  const {
    grid, toolTitle, label, errors, name, tabIndex, autoFocus, small, placeholder, shrink, disabled,
    fullWidth, helperText,
    type         = 'text',
    defaultValue = '',
    changesValue,
    errorField   = '',
    sx,
    onPrepeare, onClick, onBlur, onCallback, onSubmit, onChange, onTransform
  } = props;

  const focusRef = useRef(null);
  const Wrap = grid ? GridWrap : BoxWrap;
  const typeNum = type === 'number';
  const [value, setValue] = useState(() => prepareValue(typeNum, defaultValue));


  useEffect(() => {
    // @ts-ignore
    autoFocus && focusRef.current && focusRef.current.focus();
    // if (onTransform) { // If need transform default value
    //   const value = onTransform<string | number, string | number>(S.value);
    //   S.setValue(value);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (isNotUndefined(changesValue)) { // && ! onTransform) {
      setValue(prepareValue(typeNum, changesValue as string | number));
    }
  }, [typeNum, changesValue]);


  const handlerChange = useCallback((e: any) => {
    if (disabled) return;

    const valuePrep = onPrepeare ? onPrepeare(e.target?.value) : e.target?.value;
    setValue(prepareValue(typeNum, valuePrep));

    onCallback && onCallback(e, typeNum ? toNumber(valuePrep) : valuePrep);
    onChange && onChange(e, typeNum ? toNumber(valuePrep) : valuePrep);

    if (e.keyCode === 13) {
      onSubmit && onSubmit(e, typeNum ? toNumber(value) : value);
      // @ts-ignore
      focusRef.current && focusRef.current.blur();
    }
    else if (e.keyCode === 27) {
      onBlur && onBlur(e, typeNum ? toNumber(value) : value);
      // @ts-ignore
      focusRef.current && focusRef.current.blur();
    }
  }, [typeNum, value, disabled, onBlur, onCallback, onPrepeare, onChange, onSubmit]);


  const handlerBlur = useCallback((e: any) => {
    onCallback && onCallback(e, typeNum ? toNumber(value) : value);
    onBlur && onBlur(e, typeNum ? toNumber(value) : value);
  }, [typeNum, value, onCallback, onBlur]);



  return (
    <Wrap {...props}>
      <Tooltip title={toolTitle || ''}>
        <MuiTextField
          label           = {label}
          type            = {typeNum ? 'text' : type}
          name            = {name}
          fullWidth       = {fullWidth}
          size            = {small ? 'small' : 'medium'}
          disabled        = {disabled}
          placeholder     = {placeholder}
          value           = {value}
          inputRef        = {focusRef}
          autoFocus       = {autoFocus}
          // При автофокусе, в ненужном месте появляется блок подсказка (возможно при монтировании большого компонента, но убрал всё равно)
          autoComplete    = {autoFocus ? 'off' : 'on'}
          tabIndex        = {tabIndex}
          onChange        = {handlerChange}
          onKeyUp         = {(event: any) => {
                              if (event.key === 'Enter') {
                                // Prevent's default 'Enter' behavior.
                                event.defaultMuiPrevented = true;
                                handlerChange(event)
                              }
                            }}
          onClick         = {onClick}
          onBlur          = {handlerBlur}
          slotProps       = {{ inputLabel: { shrink } }}
          error           = {errors?.[errorField] ? true : false}
          helperText      = {errors?.[errorField] || helperText}
          sx              = {{
            // backgroundColor: '#ffffff',
            ...sx?.root,

            '& .MuiInputBase-root': {
              // backgroundColor: '#ffffff',
              ...sx?.field
            },
            '& .MuiInputBase-input': {
              ...sx?.input
            },
            '& .MuiInputLabel-root': {
              // top: '7px'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'text.light',
            },
          }}
        />
      </Tooltip>
    </Wrap>
  )
});
