import { FC, memo, MouseEvent } from 'react';
import { SxCard } from '../../../styles';
import { TextField } from '../../containers';
import { Tooltip } from '../../tooltip';



interface Props {
  type         : 'text' | 'number'
  defaultValue : number | string | undefined
  toolTitle?   : string
  disabled?    : boolean
  autoFocus?   : boolean
  width?       : string
  sx?          : SxCard
  onCallback?  : (e: MouseEvent, value: number | string) => void // Если нужно чтобы каждое изменение отображалось на экране
  onSubmit     : (e: MouseEvent, value: number | string) => void
}


export const ConfiguratorTextfieldItem: FC<Props> = memo(({ defaultValue = '', toolTitle, sx, type,
  disabled, autoFocus, width, onCallback, onSubmit
}) => (
  <Tooltip title={toolTitle} sxSpan={{ width: '100%' }}>
    <TextField
      small
      type         = {type}
      defaultValue = {defaultValue}
      autoFocus    = {autoFocus}
      disabled     = {disabled}
      onCallback   = {onCallback}
      onBlur       = {onSubmit}
      onSubmit     = {onSubmit}
      sx           = {{
        bg: {
          ...sx?.bg,
        },
        field: {
          width: width ? width : '80px',
          ...sx?.field,
        },
        input: {
          textAlign : 'center',
          padding   : '2px 4px',
        }
      }}
    />
  </Tooltip>
));
