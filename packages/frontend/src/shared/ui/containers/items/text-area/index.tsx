import { FC, memo, MouseEvent } from 'react';
import { changeGroup, setChanges, UseGroup } from 'shared/lib/hooks';
import { getValueByScheme } from 'shared/helpers/objects';
import { Errors } from 'shared/lib/validators';
import { GridStyle } from '../../grid-wrap';
import { getErrorFieldByScheme } from '../utils';
import { Textarea } from '../../elements';



interface Props {
  grid?           : GridStyle
  group           : UseGroup<any>
  name?           : string
  disabled?       : boolean
  placeholder?    : string
  autoFocus?      : boolean
  scheme          : string
  label?          : string // The label content
  changesValue?   : string // If value can be changes in any place, but not here
  // toolTitle?      : string
  tabIndex?       : number
  errorField?     : string
  errors?         : Errors
  minRows?        : number
  maxRows?        : number
  keyEnterSubmit? : boolean // If press Enter => onBlur
  sx?             : any
  // onTransform?    : <T, V>(v: T) => V // Transform default value
  onClick?        : (e?: any) => void // If need reaction after click
  onBlur?         : (e: MouseEvent, value: string) => void
  onSubmit?       : (e: MouseEvent, value: string) => void
}

/**
 * v.2024-02-08
 */
export const TextareaItem: FC<Props> = memo((props) => {
  const
    {
      name, sx, disabled, tabIndex, placeholder, keyEnterSubmit, changesValue, autoFocus, scheme, errors, grid,
      minRows, maxRows,
      group      : G,
      label      = '',
      errorField = getErrorFieldByScheme(scheme),
      onClick,
      onBlur,
      onSubmit
    } = props,


    handlerSubmit = (e: MouseEvent, value: string) => {
      changeGroup(G, [{ value, scheme }]);
      onSubmit && onSubmit(e, value);
    },

    handlerBlur = (e: MouseEvent, value: string) => {
      changeGroup(G, [{ value, scheme }]);
      onBlur && onBlur(e, value);
    },

    handlerSetChanges = () => setChanges(G);


  return (
    <Textarea
      grid           = {grid}
      // Textarea
      label          = {label}
      name           = {name}
      autoFocus      = {autoFocus}
      // toolTitle      = {toolTitle}
      disabled       = {disabled}
      placeholder    = {placeholder}
      defaultValue   = {getValueByScheme(G.group, scheme)}
      changesValue   = {changesValue || getValueByScheme(G.group, scheme)}
      tabIndex       = {tabIndex}
      errorField     = {errorField}
      errors         = {errors}
      sx             = {sx}
      minRows        = {minRows}
      maxRows        = {maxRows}
      keyEnterSubmit = {keyEnterSubmit}
      // onTransform    = {onTransform}
      onClick        = {onClick}
      onBlur         = {handlerBlur}
      onCallback     = {handlerSetChanges}
      onSubmit       = {handlerSubmit}
    />
  );
});
