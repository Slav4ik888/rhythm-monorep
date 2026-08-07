import { FC, memo, MouseEvent, useEffect, useRef } from 'react';
import MuiTextField from '@mui/material/TextField';
import { GridWrap, GridStyle } from '../../grid-wrap';
import { BoxWrap } from '../../box-wrap';
import { Tooltip } from '../../../tooltip';
import { useValue } from 'shared/lib/hooks';
import { Errors, isNotUndefined } from 'shared/lib/validators';



interface SxTextfield {
  bg?    : any
  field? : any
  input? : any
}


const useStyles = (sx?: SxTextfield) => ({
  textField: {
    // backgroundColor: '#ffffff',
    ...sx?.bg,

    '& .MuiInputBase-root': {
      // backgroundColor: '#ffffff',
      ...sx?.field
    },
    '& .MuiInputBase-input': {
      ...sx?.input
    },
    '& .MuiInputLabel-root': {
      // top: '7px'
    }
  }
});


interface Props {
  grid?         : GridStyle
  sx?           : SxTextfield
  toolTitle?    : string
  label?        : string // The label content
  type?         : 'text' | 'number' | 'password' | 'email'
  name?         : string
  small?        : boolean
  shrink?       : boolean
  fullWidth?    : boolean
  defaultValue? : string | number
  changesValue? : string | number // If value can be changes in any place, but not here
  disabled?     : boolean
  isChange?     : boolean // Нужно ли делать setIsChange(true) при handlerBlur
  placeholder?  : string
  errorField?   : string
  errors?       : Errors
  autoFocus?    : boolean
  tabIndex?     : number
  onTransform?  : <T, V>(v: T) => V // Transform default value
  onPrepeare?   : (v: string | number) => void // Transform input value before save
  onClick?      : () => void
  onBlur?       : (e: MouseEvent, v: string | number) => void
  onCallback?   : (e: MouseEvent, v: string | number) => void // Calls in handlerChange
  onSubmit?     : (e: MouseEvent, v: string | number) => void
}

/**
 * v.2023-11-24
 * @param onPrepeare - обрабатывать введённое значение ДО сохранения в onPrepeare
 */
export const TextField: FC<Props> = memo((props) => {
  const
    {
      grid, toolTitle, label, errors, name, defaultValue, tabIndex, changesValue, autoFocus, small,
      placeholder, shrink, disabled,
      type       = 'text',
      errorField = '',
      fullWidth  = true,
      sx: sxTextfield,
      onPrepeare, onClick, onBlur, onCallback, onSubmit, onTransform
    } = props,

    sx       = useStyles(sxTextfield),
    Wrap     = grid ? GridWrap : BoxWrap,
    focusRef = useRef(null),
    typeNum  = type === 'number',
    // S        = useValue(defaultValue as string | number || (typeNum ? 0 : ''));
    S        = useValue(defaultValue as string | number || '');


  useEffect(() => {
    // @ts-ignore
    autoFocus && focusRef.current && focusRef.current.focus();

    if (onTransform) { // If need transform default value
      const value = onTransform<string | number, string | number>(S.value);
      S.setValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (isNotUndefined(changesValue) && ! onTransform) {
      S.setValue(changesValue as string | number);
    }
  }, [S, changesValue, onTransform]);


  const handlerChange = (e: any) => {
    if (disabled) return null;

    const valuePrep = onPrepeare ? onPrepeare(e.target.value) : e.target.value;
    const value     = typeNum ? Number(valuePrep) : valuePrep;
    S.setValue(value);

    onCallback && onCallback(e, value);
    if (e.keyCode === 13) {
      onSubmit && onSubmit(e, S.value);
    }
    else if (e.keyCode === 27) {
      onBlur && onBlur(e, S.value);
      // @ts-ignore
      // focusRef.current && focusRef.current.blur();
    }
    return null;
  };


  const handlerBlur = (e: any) => {
    onCallback && onCallback(e, S.value);
    onBlur && onBlur(e, S.value);
  };


  return (
    <Wrap {...props}>
      <Tooltip title={toolTitle || ''}>
        <MuiTextField
          label           = {label}
          type            = {type}
          name            = {name}
          fullWidth       = {fullWidth}
          size            = {small ? 'small' : 'medium'}
          sx              = {sx.textField}
          disabled        = {disabled}
          placeholder     = {placeholder}
          value           = {S.value}
          inputRef        = {focusRef}
          autoFocus       = {autoFocus}
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
          InputLabelProps = {{ shrink }}
          error           = {errors?.[errorField] ? true : false}
          helperText      = {errors?.[errorField]}
        />
      </Tooltip>
    </Wrap>
  )
});
