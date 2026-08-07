import { FC, memo, useCallback } from 'react';
import { TextFieldDate } from '../../elements/textfield-date';
import { changeGroup, setChanges, UseGroup } from 'shared/lib/hooks';
import { GridStyle } from '../../grid-wrap';
import { getValueByScheme } from 'shared/helpers/objects';
import { Errors } from 'shared/lib/validators';
import { getMsFromDate } from 'shared/helpers/dates';



type Props = {
  grid?        : GridStyle
  box?         : boolean
  group        : UseGroup<any>
  fullWidth?   : boolean
  disabled?    : boolean
  scheme       : string
  label        : string
  type?        : 'datetime-local' | 'date' //  2023-04-14T09:19 | 2023-04-14
  toolTitle?   : string
  sx?          : any
  errorField?  : string
  errors?      : Errors
  onBlur?      : () => void
  onSubmit?    : () => void
}

/** v.2023-09-19 */
export const TextfieldDateItem: FC<Props> = memo((props) => {
  const
    {
      group: G,
      grid, box,
      fullWidth = true,
      type      = 'date',
      disabled, scheme, toolTitle, label, errorField, errors, sx,
      onBlur, onSubmit
    } = props;


  const handlerSubmit = useCallback((date: string) => {
    const value = getMsFromDate(date);
    changeGroup(G, [{ value, scheme }]);
    onSubmit && onSubmit();
  }, [scheme, G, onSubmit]);


  const handlerBlur = useCallback((date: string) => {
    const value = getMsFromDate(date);
    changeGroup(G, [{ value, scheme }]);
    onBlur && onBlur();
  }, [scheme, G, onBlur]);


  const handlerSetChanges = useCallback(() => setChanges(G), [G]);


  return (
    <TextFieldDate
      grid         = {grid}
      box          = {box}
      label        = {label}
      disabled     = {disabled}
      fullWidth    = {fullWidth}
      toolTitle    = {toolTitle}
      defaultValue = {getValueByScheme(G.group, scheme)}
      type         = {type}
      errorField   = {errorField}
      errors       = {errors}
      sx           = {sx}
      // @ts-ignore
      onBlur       = {handlerBlur}
      onCallback   = {handlerSetChanges}
      // @ts-ignore
      onSubmit     = {handlerSubmit}
    />
  );
});
