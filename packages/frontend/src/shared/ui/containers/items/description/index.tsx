import { FC, memo } from 'react';
import { Textarea } from '../../elements/textarea';
import { UseGroup, setChanges, changeGroup } from 'shared/lib/hooks';
import { getValueByScheme } from 'shared/helpers/objects';
import { Errors } from 'shared/lib/validators';
import { GridStyle } from '../../grid-wrap';



type Props = {
  grid?         : GridStyle
  group         : UseGroup<any>
  scheme?       : string
  label?        : string
  changesValue? : string // If value can be changes in any place, but not here
  placeholder?  : string
  errorField?   : string
  errors?       : Errors
}


export const Description: FC<Props> = memo((props) => {
  const
    {
      group      : G,
      grid       = { sm: 12 },
      scheme     = 'description',
      label      = 'Примечание',
      errors     = {},
      errorField = 'description',
      changesValue, placeholder,
    } = props,
    handlerBlur       = (e: any, value: string) => changeGroup(G, [{ value, scheme }]),
    handlerSetChanges = () => setChanges(G);


  return (
    <Textarea
      grid         = {grid}
      label        = {label}
      placeholder  = {placeholder}
      errorField   = {errorField}
      errors       = {errors}
      defaultValue = {getValueByScheme(G.group, scheme)}
      changesValue = {changesValue}
      onCallback   = {handlerSetChanges}
      onBlur       = {handlerBlur}
    />
  )
});
