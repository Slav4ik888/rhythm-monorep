import { FC, memo, MouseEvent } from 'react';
import { TextField } from '../../elements/textfield';
import { changeGroup, setChanges, UseGroup } from 'shared/lib/hooks';
import { getValueByScheme } from 'shared/helpers/objects';
import { Errors } from 'shared/lib/validators';
import { GridStyle } from '../../grid-wrap';
import { getErrorFieldByScheme } from '../utils';



interface Props {
  grid?         : GridStyle
  group         : UseGroup<any>
  type?         : 'text' | 'number' | 'password' | 'email'
  name?         : string
  disabled?     : boolean
  placeholder?  : string
  autoFocus?    : boolean
  fullWidth?    : boolean
  scheme        : string
  label?        : string // The label content
  changesValue? : string // If value can be changes in any place, but not here
  toolTitle?    : string
  tabIndex?     : number
  errorField?   : string
  errors?       : Errors
  sx?           : any
  onTransform?  : <T, V>(v: T) => V // Transform default value
  onPrepeare?   : (v: string | number) => void // Transform input value before save
  onBlur?       : (e: MouseEvent, value: number | string) => void
  onSubmit?     : (e: MouseEvent, value: number | string) => void
}

/**
 * v.2023-11-24
 */
export const TextfieldItem: FC<Props> = memo((props) => {
  const
    {
      name, type, sx, disabled, tabIndex, placeholder, changesValue, autoFocus, scheme, toolTitle, errors, grid,
      group      : G,
      label      = '',
      fullWidth  = true,
      errorField = getErrorFieldByScheme(scheme),
      onPrepeare,
      onTransform,
      onBlur,
      onSubmit
    } = props,


    handlerSubmit = (e: MouseEvent, value: string | number) => {
      changeGroup(G, [{ value, scheme }]);
      onSubmit && onSubmit(e, value);
    },

    handlerBlur = (e: MouseEvent, value: string | number) => {
      changeGroup(G, [{ value, scheme }]);
      onBlur && onBlur(e, value);
    },

    handlerSetChanges = () => setChanges(G);


  return (
    <TextField
      grid         = {grid}
      label        = {label}
      type         = {type}
      name         = {name}
      autoFocus    = {autoFocus}
      fullWidth    = {fullWidth}
      toolTitle    = {toolTitle}
      disabled     = {disabled}
      placeholder  = {placeholder}
      defaultValue = {getValueByScheme(G.group, scheme)}
      changesValue = {changesValue || getValueByScheme(G.group, scheme)}
      tabIndex     = {tabIndex}
      errorField   = {errorField}
      errors       = {errors}
      sx           = {sx}
      onTransform  = {onTransform}
      onPrepeare   = {onPrepeare}
      onBlur       = {handlerBlur}
      onCallback   = {handlerSetChanges}
      onSubmit     = {handlerSubmit}
    />
  );
});
