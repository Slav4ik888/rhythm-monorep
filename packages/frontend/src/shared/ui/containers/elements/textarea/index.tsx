import { FC, memo, useEffect, useRef, MouseEvent } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Box from '@mui/material/Box';
import { GridWrap, GridStyle } from '../../grid-wrap';
import { BoxWrap } from '../../box-wrap';
import { ErrorBox } from '../../error-box';
import { useValue } from 'shared/lib/hooks';
import { Errors, isNotUndefined } from 'shared/lib/validators';
import { useStyles } from './styles';
import { Label } from './label';



type Props = {
  grid?           : GridStyle
  // Textarea
  label           : string
  sx?             : any
  defaultValue?   : string
  changesValue?   : string // If value can be changes in any place, but not here
  placeholder?    : string
  name?           : string
  disabled?       : boolean
  minRows?        : number
  maxRows?        : number
  tabIndex?       : number
  errorField?     : string
  errors?         : Errors
  autoFocus?      : boolean
  keyEnterSubmit? : boolean // If press Enter => onBlur
  onClick?        : (e?: any) => void // If need reaction after click
  onBlur?         : (e: MouseEvent, v: string) => void
  onCallback?     : () => void
  // TODO: when this need this must be setup
  onSubmit?       : (e: MouseEvent, v: string) => void
}

/**
 * v.2024-02-08
 */
export const Textarea: FC<Props> = memo((props) => {
  const
    {
      grid, errors, autoFocus, label, defaultValue, name, changesValue, maxRows, keyEnterSubmit,
      errorField, placeholder, disabled, tabIndex,
      sx: styles,
      minRows = 1,
      onBlur, onClick, onCallback
    } = props;

  const
    sx       = useStyles(styles),
    focusRef = useRef(null),
    Wrap     = grid ? GridWrap : BoxWrap,
    S        = useValue(defaultValue || '');

  useEffect(() => {
    // @ts-ignore
    autoFocus && focusRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isNotUndefined(changesValue)) S.setValue(changesValue as string);
  }, [S, changesValue]);


  const handlerChange = (e: any) => {
    if (disabled) return undefined;
    S.setValue(e.target.value);

    onCallback && onCallback();
    return undefined;
  };

  const handlerBlur = (e: any) => {
    onCallback && onCallback();
    onBlur && onBlur(e, S.value);
  };

  const handlerKeyDown = (e: any) => {
    if (e.keyCode === 27 || (e.keyCode === 13 && keyEnterSubmit)) {
      onBlur && onBlur(e, S.value);
    }
  }


  return (
    <Wrap {...props}>
      <Box sx={{ position: 'relative' }} onClick={onClick}>
        <TextareaAutosize
          aria-label      = {label}
          aria-labelledby = {label}
          name            = {name}
          minRows         = {minRows}
          maxRows         = {maxRows}
          tabIndex        = {tabIndex}
          ref             = {focusRef}
          value           = {S.value}
          disabled        = {disabled}
          placeholder     = {placeholder}
          style           = {{ ...sx.field }}
          onKeyDown       = {handlerKeyDown}
          onChange        = {handlerChange}
          onBlur          = {handlerBlur}
        />

        <Label sx={sx} label={label} />
      </Box>

      <ErrorBox field={errorField} errors={errors} />
    </Wrap>
  )
});
