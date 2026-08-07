import { ChangeEvent, forwardRef, MutableRefObject, useCallback } from 'react';
import { Errors } from 'shared/lib/validators';
import StyledTextField from './styled'
import { getErrorFieldByScheme } from '../../containers';



interface Props {
  defaultValue? : string // If not ref present
  scheme        : string
  ref?          : MutableRefObject<HTMLInputElement | null>
  type?         : 'text' | 'number' | 'password' | 'email'
  fullWidth?    : boolean
  autoFocus?    : boolean
  autoComplete? : 'on' | 'off'
  disabled?     : boolean
  label?        : string
  name?         : string
  size?         : 'small' | 'medium'
  tabIndex?     : number
  errors?       : Errors
  errorScheme?  : string // Если схема для ошибки отличается от scheme
  sx?           : any
  onCancel?     : () => void
  onChange?     : (e: ChangeEvent<HTMLInputElement>, scheme: string) => void
  onSubmit?     : () => void
}

// Define props without 'ref' for forwardRef compatibility
type TextFieldItemProps = Omit<Props, 'ref'>;


export const TextFieldItem = forwardRef<null, TextFieldItemProps>((props, ref) => {
  const {
    disabled,
    scheme,
    errors,
    errorScheme,
    fullWidth = true,
    onCancel,
    onChange,
    onSubmit,
    ...rest
  } = props;


  const handleChange = useCallback((e: any) => {
    onChange && onChange(e, scheme);
    if (e.keyCode === 13) {
      onSubmit && onSubmit();
      // @ts-ignore
      // ref?.current && ref?.current?.blur();
    }
    else if (e.keyCode === 27) {
      onCancel && onCancel();
      // @ts-ignore
      // ref.current && ref.current.blur();
    }
  },
    [scheme, onChange, onCancel, onSubmit]
  );


  return (
    // @ts-ignore
    <StyledTextField
      {...rest}
      // @ts-ignore
      inputRef        = {ref}
      fullWidth       = {fullWidth}
      disabled        = {disabled}
      InputLabelProps = {{ shrink: true }}
      ownerState      = {{ disabled }}
      onKeyUp         = {(e: any) => {
        if (e.key === 'Enter') {
          // Prevent's default 'Enter' behavior.
          e.defaultMuiPrevented = true;
          handleChange(e);
        }
      }}
      // onClick         = {onClick}
      // onBlur          = {handlerBlur}
      slotProps       = {{ inputLabel: { shrink: true } }}
      onChange   = {handleChange}
      error      = {errors?.[getErrorFieldByScheme(errorScheme || scheme)] ? true : false}
      helperText = {errors?.[getErrorFieldByScheme(errorScheme || scheme)]}
    />
  )
});
