import { FC, memo, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { GridWrap, GridStyle } from '../../grid-wrap';
import { BoxWrap } from '../../box-wrap';
import { Tooltip } from '../../../tooltip';
import { useValue } from '../../../../lib/hooks';
import { Errors } from '../../../../lib/validators';
import { formatDate } from '../../../../helpers/dates';



const useStyles = (sx: any | undefined) => ({
  textField: {
    backgroundColor: '#ffffff',
    ...sx?.bg,

    '& .MuiInputBase-root': {
      backgroundColor: '#ffffff',
      ...sx?.field
    },
    '& .MuiInputLabel-root': {
      top: '7px'
    }
  }
});


type Props = {
  grid?         : GridStyle
  box?          : boolean
  toolTitle?    : string
  label         : string
  type?         : 'datetime-local' | 'date'
  fullWidth?    : boolean
  defaultValue? : string | number
  changesValue? : string | number // If value can be changes in any place, but not here
  disabled?     : boolean
  sx?           : any
  errorField?   : string
  errors?       : Errors
  onClick?      : () => void
  onBlur        : (v: string | number) => void
  onCallback?   : () => void
  onSubmit?     : (v: string | number) => void
}

/**
 * v.2023-06-03
 */
export const TextFieldDate: FC<Props> = memo((props) => {
  const
    {
      box, toolTitle, label, defaultValue, changesValue, errors, disabled, fullWidth,
      sx: styles,
      type = 'date',
      errorField = '',
      onClick, onCallback, onBlur, onSubmit
    } = props,
    sx   = useStyles(styles),
    Wrap = box ? BoxWrap : GridWrap,
    S    = useValue(defaultValue || '');


  useEffect(() => {
    const date = defaultValue ? formatDate(defaultValue, 'YYYY-MM-DD') : '';
    S.setValue(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    changesValue !== undefined && S.setValue(changesValue);
  }, [S, changesValue]);


  const handlerChange = (e: any) => {
    if (disabled) return undefined;
    S.setValue(e.target.value);

    onCallback && onCallback();

    if (e.keyCode === 13 || e.keyCode === 27) {
      onSubmit && onSubmit(S.value as number | string);
      onBlur && onBlur(S.value as number | string);
      return undefined
    }
    onBlur && onBlur(S.value as number | string);
    return undefined
  };

  const handlerBlur = () => {
    onCallback && onCallback();
    onBlur && onBlur(S.value as number | string);
  };


  return (
    <Wrap {...props}>
      <Tooltip title={toolTitle || ''}>
        <TextField
          label           = {label}
          type            = {type}
          fullWidth       = {fullWidth}
          sx              = {sx.textField}
          disabled        = {disabled}
          value           = {S.value}
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
          InputLabelProps = {{ shrink: true }}
          error           = {errors?.[errorField] ? true : false}
          helperText      = {errors?.[errorField]}
        />
      </Tooltip>
    </Wrap>
  )
});
